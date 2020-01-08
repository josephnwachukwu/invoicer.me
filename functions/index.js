
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin  = require('firebase-admin');
const cors = require('cors')
const express = require('express');
const puppeteer = require('puppeteer');
const pdfkit = require('pdfkit');
admin.initializeApp();

const app = express();

// increase function memory and time limit
const runtimeOpts = {
  timeoutSeconds: 120,
  memory: '1GB'
}


// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Runs before every route. Launches headless Chrome.
app.all('*', async (req, res, next) => {
  // Note: --no-sandbox is required in this env.
  // Could also launch chrome and reuse the instance
  // using puppeteer.connect()
  res.locals.browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  next(); // pass control to next route.
});




// Handler to take screenshots of a URL.
app.get('/screenshot', async function screenshotHandler(req, res, next) {

  const url = req.query.url;
  if (!url) {
    return res.status(400).send(
      'Please provide a URL. Example: ?url=https://example.com');
  }
  const browser = res.locals.browser;
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1100,
      height: 1200,
      deviceScaleFactor: 1,
    });
    await page.goto(url, {waitUntil: 'networkidle2'});
    const buffer = await page.screenshot({fullPage: true});
    // now make pdf 
    var doc = new pdfkit();
    // add image
    doc.scale(0.81).image(buffer, 0, 0, {fit: [800, 800]})

    res.setHeader('Content-disposition', 'inline; filename=invoice.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.end();

  } catch (e) {
    res.status(500).send(e.toString());
  }
  await browser.close();
});


exports.sendInvoiceEmail = functions.firestore.document('/invoices/{invoiceID}').onCreate((snap, context) => {


  const newValue = snap.data();
  const location = newValue.location
  const toEmail = newValue.recipientEmail
  const message = newValue.recipientMessage
  const name = newValue.senderName

  let smtpConfig = {
    host: 'smtp.netfirms.com',
    port: 587,
    secureConnection: false,
    auth: {
      user: 'support@invoicer.me',
      pass: 'Aventador1'
    },
    tls: {rejectUnauthorized: false}
  };

  let transport = nodemailer.createTransport(smtpConfig);


  let mailOptions = {
    from: '"Invoicer.me" <support@invoicer.me>',
    to: toEmail,
    subject: `${name} has sent you an invoice`,
    html: `Hello,<br> <p>${name} created an invoice on invoicer.me and has sent it to you for processing. Invoicer.me is an app that allows you to create invoices and send them to clients all around the world. </p>A copy of the invoice can be viewed at ${location} <br> <p>If you feel you have recieved this invoice in error please contact us at support@invoicer.me</p><br><br>Thank you from invoicer. <br> ${message}`
  };

  
  if(toEmail) {
    return transport.sendMail(mailOptions, (err, info) => {
      if(err) {
        console.log(err)
      }
      else {
        console.log(info)
      }
    });
  }
});



exports.api = functions.runWith({ memory: '1GB', timeoutSeconds: 120 }).https.onRequest(app);

// exports.test = functions.https.onRequest((req, res) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   if (req.method === 'OPTIONS') {
//     // Send response to OPTIONS requests
//     res.set('Access-Control-Allow-Methods', 'GET');
//     res.set('Access-Control-Allow-Headers', 'Content-Type');
//     res.set('Access-Control-Max-Age', '3600');
//     res.status(204).send('');
//   } else {
//     res.send(JSON.stringify('test'))
//   }
// });

// app.get('/test2', (req, res) => {
//   return res
//     //.type('application/manifest+json')
//     .status(200)
//     .send(JSON.stringify({message: 'OK'}));
// });


// let mailTransport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
// });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });



// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;


// Handler that prints the version of headless Chrome being used.
// app.get('/version', async function versionHandler(req, res) {
//   const browser = res.locals.browser;
//   res.status(200).send(JSON.stringify(await browser.version()));
//   await browser.close();
// });
