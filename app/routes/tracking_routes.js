let unique = require('uniqid');

module.exports = (app, client, logger) => {
    app.get('/:id-tracker.png', (request, response, next) => {
        // Set trackerID from params
        let trackerId = request.params.id;
        let clientIp = request.connection.remoteAddress;

        // TODO: Retrieve TO from email headers
        // Create buffer for transparent image
        let buf = new Buffer.from([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
            0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
            0x02, 0x44, 0x01, 0x00, 0x3b
        ]);

        // Set content-type of response to png
        response.set('Content-Type', 'image/png');

        // Set end of response to the binary image
        response.end(buf, 'binary');

        // Handle updating tracker's information
        client.hgetall(trackerId, (err, reply) => {
            if (reply != null) {
                // Increment Open count regardless of status
                client.hincrby(trackerId, "openCount", 1);

                // TODO: Implement storing lists searchable by hash. For now store IPs in , delimited list
                let ipList = reply.clientIps + clientIp + ',';
                client.hset(trackerId, 'clientIps', ipList);

                // Store Last opened time
                let currentTime = new Date();
                client.hset(trackerId, 'lastOpened', currentTime.toUTCString());

                if (reply.status === "Generated") {
                    // Set status to Opened
                    client.hmset(trackerId, "status", "Opened");

                    // Emit open event
                    app.emit('event:opened', reply.id);
                }
                else if (reply.status === "Opened") {
                    // Set status to Re-Opened
                    client.hmset(trackerId, "status", "Re-Opened");

                    // Emit reopened event
                    app.emit('event:reopened', reply.id);
                }
                else if (reply.status === "Re-Opened") {
                    // Emit reopened event
                    app.emit('event:reopened', reply.id);
                }

            }
            else {
                logger.errorLog.info("No data found for tracker ID: " + trackerId);
            }
        });
    });

    app.get('/tracker', (request, response, next) => {
        /*
        Create tracking id for image
        Save newly created id associate it with email from req body
        with timestamp, IP address, and status (default: opened; if opened again: re-opened)
        */

        response.set({"Content-Type": "application/json"});

        // Get unique id for tracker
        let trackerId = unique();

        client.sadd("trackers", trackerId);

        // TODO: Implement auth to grab client
        client.hmset(trackerId, "client", "tests@example.com", "status", "Generated", "openCount", 0, "id", trackerId, "clientIps", []);

        // Retrieve all data for the new tracker
        client.hgetall(trackerId, (err, reply) => {
            response.send({imageUrl: "http://127.0.0.1:8000/" + reply.id + "-tracker.png"});
        });
    });

    // Check status of tracker's by id
    app.get('/:id/status', (request, response, next) => {
        let trackerId = request.params.id;

        logger.accessLog.info("Checking status for tracker: " + trackerId);

        client.hgetall(trackerId, (err, reply) => {
            if (reply != null){
                response.send(reply);
            }
            else {
                logger.errorLog.info("No tracker found with ID: " + trackerId);
                response.status(404).send('Not found');
            }
        });

    });

    app.on('event:opened', (tracker) => {
        logger.accessLog.info('Email was opened');
        logger.accessLog.info(tracker);
    });

    app.on('event:reopened', (tracker) => {
        logger.accessLog.info('Email was re-opened');
        logger.accessLog.info(tracker);
    });
};