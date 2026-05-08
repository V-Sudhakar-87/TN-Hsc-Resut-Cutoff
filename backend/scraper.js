const axios =
require("axios");

const cheerio =
require("cheerio");

/* SCRAPER */

async function scrapeResult(
   regNo,
   dob
){

   try{

      console.log(
         "=========================="
      );

      console.log(
         "TN RESULT SCRAPER START"
      );

      console.log(
         "REG NO :",
         regNo
      );

      console.log(
         "DOB :",
         dob
      );

      /* FORM DATA */

      const formData =
      new URLSearchParams();

      formData.append(
         "regno",
         regNo
      );

      formData.append(
         "dob",
         dob
      );

      formData.append(
         "B1",
         "Get Marks"
      );

      console.log(
         "FORM DATA READY"
      );

      //console.log(  formData.toString());

      /* REQUEST */

      console.log(
         "SENDING REQUEST..."
      );

      const response =
      await axios.post(

         "https://tnresults.nic.in/2026_HSCtnresults/2026_9994hsc.asp",

         formData.toString(),

         {

            headers:{

               "Content-Type":

               "application/x-www-form-urlencoded",

               "User-Agent":
               "Mozilla/5.0",

               "Referer":

               "https://tnresults.nic.in/2026_HSCtnresults/2026_5341hsc.htm",

               "Origin":
               "https://tnresults.nic.in"

            },

            timeout:15000

         }

      );

      console.log(
         "STATUS :",
         response.status
      );

      /* HTML */

      const html =
      response.data;

      console.log(
         "HTML RECEIVED"
      );

     // console.log( html.slice(0,500));

      /* PARSE */

      const $ =
      cheerio.load(html);

      /* TITLE */

      const title =

      $("title")
      .text()
      .trim();

      console.log(
         "TITLE :",
         title
      );

      /* INVALID CHECK */

      if(

         html
         .toLowerCase()
         .includes("invalid")

      ){

         console.log(
            "INVALID DATA"
         );

         return null;

      }

      /* STUDENT NAME */

      let name =

$("b")
.first()
.text()
.trim();

/* REMOVE REG NO */

name =

name
.replace(regNo,"")
.replace("(","")
.replace(")","")
.trim();

     // console.log("NAME :",name);

      if(!name){

         name = "STUDENT";

      }

      /* SUBJECT ARRAY */

      const subjects = [];

      $("table tr").each(

         (i,row)=>{

            const td =
            $(row).find("td");

            /* SKIP INVALID ROW */

            if(td.length < 5){

               return;

            }

            const subjectName =

            $(td[0])
            .text()
            .trim();

            /* SKIP EMPTY */

            if(!subjectName){

               return;

            }
            /* SKIP COLUMN HEADER */

if(

   subjectName
   .toLowerCase()
   .includes("subject")

){

   return;

}

            /* SKIP TOTAL */

            if(

               subjectName
               .toLowerCase()
               .includes("total")

            ){

               return;

            }

            /* SUBJECT */

            const subjectData = {

               subject:

               subjectName,

               internal:

               Number(

                  $(td[1])
                  .text()
                  .trim()

               ) || 0,

               theory:

               Number(

                  $(td[2])
                  .text()
                  .trim()

               ) || 0,

               practical:

               Number(

                  $(td[3])
                  .text()
                  .trim()

               ) || 0,

               total:

               Number(

                  $(td[4])
                  .text()
                  .trim()

               ) || 0

            };

          //  console.log("SUBJECT :",subjectData);

            subjects.push(
               subjectData
            );

         }

      );

    //  console.log("TOTAL SUBJECTS :",subjects.length);

      /* NO SUBJECT */

      if(subjects.length === 0){

         console.log(
            "NO SUBJECTS FOUND"
         );

         return null;

      }

      /* FINAL RESULT */

      const result = {

         name,

         regNo,

         subjects

      };

      console.log(
         "FINAL RESULT"
      );

     // console.log(result);

      console.log(
         "=========================="
      );

      return result;

   }

   catch(err){

      console.log(
         "SCRAPER ERROR"
      );

      if(err.response){

         console.log(
            "STATUS :",
            err.response.status
         );

         console.log(
            err.response.data
         );

      }

      else{

         console.log(err);

      }

      return null;

   }

}

module.exports =
scrapeResult;