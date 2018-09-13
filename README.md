# EmailBeacon Project
##### The purpose of this project is to construct a service that generates traceable 1px by 1px transparent images for emails. 
##### These images are uniquely generated and when they are loaded it keeps track of how many times.


## Setup

``` bash
# First run
docker-compose build

# Then 
docker-compose up

# To rebuild
docker-copose up --build

```

## Usage
1. Perform a GET call to http://localhost:8000/tracker
    + That will generate a unique imageURL to be used in html email templates.
2. Once loaded in an email the services receives the calls and tracks the state of the tracker.
    + There are Three states "Generated", "Opened", "Re-Opened".
    + Each new load of the unique image url will increment a counter and change the status.
3. You can check the status of a given imageUrl by using it's ID in the following call http://localhost:8000/<ID>/status
    + This will return the status, openCount, IPs it was opened on, and a timestamp of the last open.

## Tests
``` bash
# First install dependencies locally
npm install

# Tests will run with coverage
npm test
```

## Notes
##### This project is just using redis-mock temporarily to avoid database setup.

## TODO
+ Get Email Headers (TO, FROM)
+ Kubernetes Deployment strategy