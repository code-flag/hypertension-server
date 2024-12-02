
/**
 * This method checks wether a key exist in an object or not
 * @param {*} obj 
 * @param {*} key 
 * @returns 
 */
export const isObjectKey = (obj: any, key: string) => {
  if (typeof obj == "object") {
    // check for payee key
    if (Object.keys(obj).includes(key)) {
      return true;
    } else {
      return false;
    }
  } else {
    console.log(
      "Argument is not a valid object or object of objects",
      obj,
      "search key",
      key
    );
    return false;
  }
};

/** this line is added resolve issue due to the query always replace + character with empty space */
export const strReplaceAll = (str: string, key: string): string => {
  let newString: string = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] == " ") {
      newString = newString + key;
    } else {
      newString = newString + str[i];
    }
  }
  return newString;
};

/**
 * This function helps in converting camel case to spaced words
 * @param {string} str - the string value in camel case to be converted to spaced words
 * @returns {string} - the formatted spaced words value
 */
export const camelCaseToSeparateWords = (str: string) => {
  return str
    .split("")
    .map((letter, idx) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? " " : ""}${letter?.toLowerCase()}`
        : letter;
    })
    .join("");
};

export const getDataAddedPerMonth = (userDocs: any) => {
  let dataPerYear: any = {};
  let months: any = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  let prevYear: any = 0;
  let prevMonth: any = 0;
  let counter: any = 0;

  userDocs && userDocs.forEach((data: any) => {
    
    if (data?.createdAt) {
      // convert document Iso date to normal date
    let date: any = new Date(data.createdAt);
    let year: any = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let dt: any = date.getDate();

    // change the month value to two digit string value
    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    // initiate the year data if its not yet captured
    if (prevYear !== year) {
      counter = 1;
      dataPerYear[year] = { [months[month]]: counter };

      // update the previous variable values
      prevMonth = month;
      prevYear = year;
      counter++;
    } else {
      if (prevMonth !== month) {
        counter = 1;
        dataPerYear[year][months[month]] = counter;
        counter++;
      } else {
        dataPerYear[year][months[month]] = counter++;
      }
      // update the previous variable values
      prevYear = year;
      prevMonth = month;
    }
    }
  });

  return dataPerYear;
};

export const getTxnPerMonth = (userDocs: any, amountField: string) => {
  let dataPerYear: any = {};
  let months: any = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  let prevYear: any = 0;
  let prevMonth: any = 0;
  let counter: any = 0;
  let value: number = 0;

  userDocs.forEach((data: any) => {
    // convert document Iso date to normal date
    let date: any = new Date(data.createdAt);
    let year: any = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let dt: any = date.getDate();

    // change the month value to two digit string value
    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    // initiate the year data if its not yet captured
    if (prevYear !== year) {
      counter = 1;
      value = value + Number(data[amountField]);
      dataPerYear[year] = { [months[month]]: value };

      // update the previous variable values
      prevMonth = month;
      prevYear = year;
      counter++;
    } else {
      if (prevMonth !== month) {
        counter = 1;
        value = value + Number(data[amountField]);
        dataPerYear[year][months[month]] = value;
        counter++;
      } else {
        dataPerYear[year][months[month]] = value + Number(data[amountField]);
      }
      // update the previous variable values
      prevYear = year;
      prevMonth = month;
    }
  });

  return dataPerYear;
};

// export const formatSpeialCharacter = (str: string) => {
//   let parser = new DOMParser();
//   let decodedString = parser.parseFromString(str, 'text/html').body.textContent;
//   return decodedString;
// }

// const { decode } = require('html-entities');

// function containsEncodedComponents(x) {
//     return decode(x);
// }

export const getStaffActivity = (staffData: any, activity: string, userType = "cooperative-staff" ) => {
  return {
    /** this is the id of the user that updated the service request record */
    staffId: staffData?._id,
    fullName: `${staffData?.firstName} ${staffData?.lastName}`,
    userType,
    /** This field described what staff did in essence  */
    activity
  };
}
