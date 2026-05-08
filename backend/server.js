const express =
require("express");

const cors =
require("cors");

const scrapeResult =
require("./scraper");

const cache =
require("./cache");
const path =
require("path");
const app = express();

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());
/* FRONTEND */

app.use(express.static(path.join(__dirname,"public")));
/* HOME */

app.get("/", (req,res)=>{

   res.send(
      "TN Result Backend Running"
   );

});

/* API */

app.post(
   "/get-result",

   async(req,res)=>{

      try{

         const {
            regNo,
            dob
         } = req.body;

         /* VALIDATION */

        // console.log("REQUEST :",regNo,dob);

         if(!regNo || !dob){

            return res.status(400)
            .json({

               success:false,

               message:
               "Reg No and DOB required"

            });

         }

         /* CACHE CHECK */

         if(

            cache[regNo + dob] &&

            cache[regNo + dob].expiry >
            Date.now()

         ){

           // console.log("CACHE HIT");

            return res.json({

               success:true,

               data:
               cache[regNo + dob].data

            });

         }

         //console.log("CACHE MISS");

         /* SCRAPER */

         const result =
         await scrapeResult(
            regNo,
            dob
         );

         /* INVALID */

         if(!result){

            return res.status(404)
            .json({

               success:false,

               message:
               "Invalid Register Number or DOB"

            });

         }

         /* SUBJECT FIND */

         const maths =
         result.subjects.find(

            s =>

            s.subject
            .toLowerCase()
            .includes("math")

         );

         const physics =
         result.subjects.find(

            s =>

            s.subject
            .toLowerCase()
            .includes("physics")

         );

         const chemistry =
         result.subjects.find(

            s =>

            s.subject
            .toLowerCase()
            .includes("chem")

         );

         const biology =
         result.subjects.find(

            s =>

            s.subject
            .toLowerCase()
            .includes("bio")

         );

         /* TOTAL */

         const totalMarks =
         result.subjects.reduce(

            (sum,sub)=>

            sum + sub.total,

            0

         );

         result.total =
         totalMarks;

         /* PERCENTAGE */

         const percentage = (

            totalMarks /

            result.subjects.length

         ).toFixed(2);

         result.percentage =
         percentage + "%";
         /* FAIL CHECK */

const failedSubject =

result.subjects.find(

   sub => sub.total < 35

);

if(

   failedSubject ||

   totalMarks < 210

){

   result.fail = true;

}

else{

   result.fail = false;

}

         /* ENGINEERING CUTOFF */

         if(
            !result.fail &&
            maths &&
            physics &&
            chemistry

         ){

            const engCutoff = (

               maths.total +

               (

                  physics.total +
                  chemistry.total

               ) / 2

            ).toFixed(2);

            result.cutoff =
            engCutoff;

         }

         /* MEDICAL CUTOFF */

         if(
            !result.fail &&
            biology &&
            physics &&
            chemistry

         ){

            const medCutoff = (

               biology.total +

               (

                  physics.total +
                  chemistry.total

               ) / 2

            ).toFixed(2);

            result.medicalCutoff =
            medCutoff;

         }

         /* SAVE CACHE */

         cache[regNo + dob] = {

            data:result,

            expiry:
            Date.now() +
            10 * 60 * 1000

         };

         //console.log( "CACHE SAVED" );

         /* RESPONSE */

         res.json({

            success:true,

            data:result

         });

      }

      catch(err){

         console.log(
            "SERVER ERROR :",
            err
         );

         res.status(500)
         .json({

            success:false,

            message:
            "Server Error"

         });

      }

});

/* SERVER */
const PORT =

process.env.PORT || 5000;

app.listen(PORT, ()=>{

   console.log(

      `Server running on port ${PORT}`

   );

});