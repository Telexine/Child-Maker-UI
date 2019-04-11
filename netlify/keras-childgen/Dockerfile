FROM gcc:7

#Install CMAKE
RUN curl https://cmake.org/files/v3.13/cmake-3.13.2-Linux-x86_64.sh -o /tmp/curl-install.sh \
      && chmod u+x /tmp/curl-install.sh \
      && mkdir /usr/bin/cmake \
      && /tmp/curl-install.sh --skip-license --prefix=/usr/bin/cmake \
      && rm /tmp/curl-install.sh

ENV PATH="/usr/bin/cmake/bin:${PATH}"
#Install python lib
RUN apt update && apt install 
RUN apt install python-pip -y
#Install python lib
ADD requirements.txt /usr/src/app/
WORKDIR /usr/src/app
RUN pip install -r requirements.txt 
RUN pip install numpy opencv-python dlib imutils
#Copy current file to container folder
ADD . /usr/src/app
#open port 5000
EXPOSE 5000
#make folder
RUN mkdir -p upload
RUN mkdir -p decoded
#run
CMD [ "python", "autoencoder.py" ]
