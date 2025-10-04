echo "Creating zip for layer"
zip -r layer.zip nodejs

echo "Creating zip for GET Function"
cd methods/get
zip -r get.zip index.mjs
mv get.zip ../../
cd ../..

echo "Creating zip for POST Function"
cd methods/post
zip -r post.zip index.mjs
mv post.zip ../../
cd ../..

echo "Creating zip for PUT Function"
cd methods/put
zip -r put.zip index.mjs
mv put.zip ../../
cd ../..

echo "Creating zip for Upload POST Function"
cd methods/upload
zip -r upload.zip index.mjs
mv upload.zip ../../
cd ../..

echo "Creating zip for Textract Function"
cd methods/processImage
zip -r processImage.zip index.mjs
mv processImage.zip ../../
cd ../..

echo "Creating zip for DELETE Function"
cd methods/delete
zip -r delete.zip index.mjs
mv delete.zip ../../
cd ../..
echo "Success!"