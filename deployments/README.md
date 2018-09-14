# EmailBeacon Deployment
##### This will outline steps taken to deploy to GCP utilizing Kubernetes engine.


## Setup
######Make sure you install and setup gcloud SKD
``` bash
# First run
gcloud config set project PROJECT_ID
gcloud config set compute/zone us-central1-a

# Set ProjectID environment variable
export PROJECT_ID="$(gcloud config get-value project -q)"

# cd into project directory
docker build -t gcr.io/${PROJECT_ID}/email-beacon:v1 .

# Make sure docker is authed with gcloud
gcloud auth configure-docker

# Push image to GCR
docker push gcr.io/${PROJECT_ID}/email-beacon:v1

# Create your cluster
gcloud container clusters create beacon-cluster --num-nodes=1

# Deploy the beacon-service
kubectl run beacon-service --image=gcr.io/${PROJECT_ID}/email-beacon:v1 --port 8000

# Expose the app utilizing a load balancer 
kubectl expose deployment beacon-service --type=LoadBalancer --port 80 --target-port 8000

# Retrive new external IP
kubectl get service

# To rebuild
docker-copose up --build

```

## Notes
Since there is no set vanity domain at this time the service returns the default 127.0.0.1:8000 as the imageUrl host. 
You will need to replace that with the external IP for now.