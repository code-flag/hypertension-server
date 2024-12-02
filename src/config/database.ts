// import mongoose, { ConnectOptions } from "mongoose";
// import dotenv from "dotenv";
// import { sendMail } from "./../helper/mailer";

// dotenv.config();

// const url: string = process.env.DB_CONNECTION_URL ?? "";

// mongoose.set("strictQuery", true);

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// export const DBConnection = () => {
//   mongoose.connect(
//     url,
//     options as ConnectOptions,
//     (err: any) => {
//       if (err) {
//         console.log("Error: Could not connect to the database\n", err?.message);
//       } else {
//         console.log("Database successfully connected");

//         // Call the Change Stream watcher for Loans collection
//         watchLoanCollection();
//       }
//     }
//   );
// };

// // Watcher for Loans Collection
// const watchLoanCollection = () => {
//   const loanCollection = mongoose.connection.collection("loans");

//   console.log("Starting to watch changes in the Loans collection...");

//   const changeStream = loanCollection.watch();

//   changeStream.on("change", async (change) => {
//     console.log("Change detected:", change);

//     // Handle updates
//     if (change.operationType === "update") {
//       const updatedFields = change.updateDescription?.updatedFields;

//       if (updatedFields && updatedFields.amount) {
//         const loanId = change.documentKey._id;
//         const newAmount = updatedFields.amount;

//         console.log(`Loan ID: ${loanId} has a new amount: ${newAmount}`);

//         // Send Email Notification

//         await sendMail("awefrancolaz@gmail.com", "Database Alteration Notification", 
//           `
//           Hi Francis,
//           <br>
//           <p>Note: A change has just been made to database Loan collection. Loan ID: ${loanId} has a new amount: ${newAmount}.
//           <br>
//           If this is suspicious kindly find a means to stop it
//           </p>

  

//           <p> Thank you </p>
//           `
//         )
//       }
//     }
//   });

//   changeStream.on("error", (error) => {
//     console.error("Error in Change Stream:", error);
//   });
// };















import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url: string = process.env.DB_CONNECTION_URL ?? "";

mongoose.set("strictQuery", true);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

export const DBConnection = () => {
  mongoose.connect(
    url,
    options  as ConnectOptions,
    (err: any) => {
      if (err) {
        console.log("error could not connect to database \n", err?.message);
      } else {
        console.log("Database successfully connected");
      }
    }
  );
};
