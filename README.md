 
![img](https://github.com/Telexine/Child-Maker-UI/blob/master/s1.png)
![img](https://github.com/Telexine/Child-Maker-UI/blob/master/s3.png)
![img](https://github.com/Telexine/Child-Maker-UI/blob/master/s2.png)
Child Maker - Generate Child from parent image with Docker
================

Simple autoencoder predictor  with simple front-end on dockerize/kube config 

Architecture 
------------

### Backend
- Python 
- Tesorflow/keras
- imutils, dlib for simple canvas draw
- Docker/Kube

### Frontend
- NodeJs Express
- materialize css
- request

Requirements(Docker)
------------
- Docker with kube enable


Installation
------------

## Setup Kubernates

### 1. Install kubectl

```
brew install  kubectl
```


### 2. create dashboard

< Must Enable kube in docker before this >
```
kubectl config current-context docker-for-desktop

kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended/kubernetes-dashboard.yaml
 

kubectl apply -f dashboard-adminuser.yaml

```
#### Now we need to find token we can use to log in. Execute following command:

```kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')```

Now copy the token and paste it into Enter token field on log in screen. 
 
```http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/```

### 3. Deploy  
Move to directory kubeconfig/ 

in kubeconfig 
```sh
$ bash build.sh
```

access via 
```
http://localhost/
```

## Setup native

we need to edit hostname before run both script

in node/server.js
```
(line 38) let backendsvcname = "http://childgen-python.default.svc.cluster.local:5000/"
(line 39) un-comment#  let backendsvcname = "http://localhost:5000/"
```
