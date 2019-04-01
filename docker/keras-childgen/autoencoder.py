from flask import Flask,request,url_for, send_from_directory
from werkzeug.datastructures import ImmutableMultiDict
import os,sys
app = Flask(__name__)
from werkzeug import secure_filename
from imutils import face_utils
import imutils
import dlib
import cv2
## Keras
import scipy
import matplotlib.pyplot as plt
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from keras.models import Sequential, load_model
import scipy
from PIL import Image,ImageEnhance
import numpy as np
from keras_contrib.layers.normalization.instancenormalization import InstanceNormalization
##from keras_contrib.layers.normalization import InstanceNormalization
import tensorflow as tf
import cv2
global model,prep
autodencoder = load_model('./models/autoencoder_model.h5')
autodencoder.load_weights('./models/autoencoder_weights1.h5')
 
postProcess = load_model('./models/sharpen_model.h5')
postProcess.load_weights('./models/sharpen_weights.h5')
 
global graph 
graph = tf.get_default_graph()
p = "shape_predictor_68_face_landmarks.dat"
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(p)

def imread(path):
        return scipy.misc.imfilter(scipy.misc.imfilter(scipy.misc.imread(path, mode='RGB').astype(np.float),ftype='smooth_more'),ftype='smooth')

def imprep(path) : 
        c = imread(path)
        c = scipy.misc.imresize(c, (64, 64))
        c = np.array(c)/125.5 - 1.#edges
        c = np.expand_dims(c, axis=0)
        return  c
def imprep2(c) : 
        c = scipy.misc.imresize(c, (64, 64))
        c = np.array(c)/125.5 - 1.#edges
        c = np.expand_dims(c, axis=0)
        return  c
# END keras 
ROOT_DIR = os.path.dirname(os.path.abspath(__file__)) 
_IP = "http://localhost:5000/"
app.config['upload'] = os.path.join("upload")
app.config['decoded']  = os.path.join("decoded")
 
@app.route('/')
def hello():
    return 'Hello Container World!'

@app.route('/gen',methods =  ['POST'])
def gen():
    print("got request")
    if request.method == 'POST':
        file = request.files['file']
        if file :
            print ('**found file', file.filename)
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['upload'], filename))
            img= cv2.imread(os.path.join(app.config['upload'], filename))
            height, width,alp = img.shape
            im =imprep(os.path.join(app.config['upload'], filename))

            #print (height, width,alp)

            #Draw rec
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            rects = detector(gray,1)
            print(rects)
            for (i, rect) in enumerate(rects):
                # array
                shape = predictor(gray, rect)
                shape = face_utils.shape_to_np(shape)
                (x, y, w, h) = face_utils.rect_to_bb(rect)
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
                cv2.imwrite(os.path.join(app.config['upload'], filename),img)
        generated_b = []
        for i in range(8):
                autodencoder.load_weights('./models/autoencoder_weights%s.h5'% (i+1))
                print(i)
                with graph.as_default():
                        
                        # Encode to feature
                        child1 = autodencoder.predict(im)
        
        
                        child1 =scipy.misc.imresize( np.concatenate(child1),(height,width))

                        child1 = imprep2(child1)
                        child1 = postProcess.predict(child1)
                        child1 =scipy.misc.imresize( np.concatenate(child1),(height,width))
                        
                        scipy.misc.imsave( "./decoded/child-"+file.filename,  child1)
                        img = Image.open( "./decoded/child-"+file.filename)
                        if i == 6:
                                converter =   ImageEnhance.Sharpness(img)
                                out = converter.enhance(1.1)
                        
                        img.save("./decoded/child"+str(i+1)+"-"+file.filename)
        return _IP+"upload/"+file.filename+','+_IP+'decoded/child'+str(i)+'-'+file.filename

        return 'Error'

@app.route('/upload/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['upload'],
                               filename,as_attachment=True)
@app.route('/decoded/<filename>')
def file(filename):
    return send_from_directory(app.config['decoded'],
                               filename,as_attachment=True)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
