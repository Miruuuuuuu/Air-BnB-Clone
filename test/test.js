const mongoose = require('mongoose');
const listing = require('./path/to/your/listing/model'); // Update with the correct path

async function updateImageField() {
    try {
        await mongoose.connect('mongodb://localhost:27017/your_database_name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const result = await listing.updateMany(
            {},
            [
                {
                    $set: {
                        image: {
                            $toString: "$image.url"  // Convert the value to string from the object
                        }
                    }
                }
            ]
        );

        console.log(`${result.modifiedCount} documents updated.`);
    } catch (error) {
        console.error('Error updating documents:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateImageField();
