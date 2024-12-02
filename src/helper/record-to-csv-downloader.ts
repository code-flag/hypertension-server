const fs = require('fs');
import * as fastcsv from 'fast-csv';
const { Readable } = require('stream');

// Example headerField mapping
const headerField = {
    userId: "User Id",
    'estate.firstName': "First Name",
    'estate.lastName': "Last Name",
    'estate.createdAt': "Created Date",
    'estate.updatedAt': "Updated Date",
    'estate.building.0.buildingId.number': "Building Number" // Accessing the first building
};

// Sample data from the database
const data = [
    {
        userId: "67058ecb50933b9efa32c830",
        estate: [
            {
                estateId: "6380ecaa0120d50f9df141be",
                email: "devpr1@cpaat-consulting.com",
                firstName: "PR",
                lastName: "Dev",
                createdAt: "2024-10-08T19:58:09.228Z",
                updatedAt: "2024-10-15T23:33:36.800Z",
                building: [
                    {
                        buildingId: {
                            number: "8"
                        }
                    }
                ]
            }
        ],
        createdAt: "2024-10-08T19:58:09.229Z",
        updatedAt: "2024-10-15T23:33:36.800Z"
    }
];

// Function to map data based on headerField
const mapDataToCSV = (data: any[], headerField: any) => {
    return data.map(record => {
        const mappedRecord: any = {};
        for (const key in headerField) {
            const keys = key.split('.'); // Split keys for nested objects
            let value = record;
            for (const k of keys) {
                value = value[k];
                if (value === undefined) break; // If any key is not found, stop
            }
            mappedRecord[headerField[key]] = Array.isArray(value) ? value[0] || '' : value || ''; // Handle arrays and undefined values
        }
        return mappedRecord;
    });
};

// Convert data to CSV format
const convertToCSV = async () => {
    const csvData = mapDataToCSV(data, headerField);
    const ws = fs.createWriteStream('output.csv');

    fastcsv
        .write(csvData, { headers: true })
        .on('finish', () => {
            console.log('CSV file created successfully.');
        })
        .pipe(ws);
};


// Route to get CSV /download-csv
export const csvFileGenerator = (req: any, res: any) => {
    const csvData = mapDataToCSV(data, headerField);
    const readableStream = Readable.from(csvData);

    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    res.setHeader('Content-Type', 'text/csv');

    readableStream
        .pipe(fastcsv.format({ headers: true }))
        .pipe(res)
        .on('finish', () => {
            console.log('CSV file sent successfully.');
        })
        .on('error', (err: any) => {
            console.error('Error sending CSV file:', err);
            res.status(500).send('Error generating CSV file.');
        });
};

// in web 
// <a href="http://localhost:3000/download-csv" download="data.csv">Download CSV</a>