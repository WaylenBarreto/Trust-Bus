from keras.models import load_model

model = load_model(
    "fer2013_mini_XCEPTION.102-0.66.hdf5",
    compile=False
)

# save architecture
model_json = model.to_json()
with open("facialemotionmodel.json", "w") as json_file:
    json_file.write(model_json)

# ⭐ new keras requires .weights.h5
model.save_weights("facialemotionmodel.weights.h5")

print("✅ Model converted successfully!")
