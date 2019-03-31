FROM python:3.6
#Install python lib
ADD requirements.txt /usr/src/app/
WORKDIR /usr/src/app
RUN pip install -r requirements.txt 
RUN pip install git+https://www.github.com/keras-team/keras-contrib.git
#Copy current file to container folder
ADD . /usr/src/app
#open port 5000
EXPOSE 5000
#make folder
RUN mkdir -p upload
RUN mkdir -p conv
#run
CMD [ "python", "autoencoder.py" ]