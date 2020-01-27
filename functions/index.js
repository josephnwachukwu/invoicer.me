
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin  = require('firebase-admin');
const cors = require('cors')
const express = require('express');
const puppeteer = require('puppeteer');
const pdfkit = require('pdfkit');
const helper = require('firebase-functions-helper');

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

// Email The Invoice as am attachment. 
app.post('/emailInvoice', async function emailHander(req, res, next) {
  console.log('invoice = ', req.body)

  const browser = res.locals.browser;
  const toEmail = req.body.recipientEmail
  const message = req.body.recipientMessage
  const name = req.body.senderName
  const location = 'testlocation'

  let id

  admin.firestore().collection('invoices').add(req.body)
    .then(function(docRef) {
        console.log('docRefID', docRef.id)
        id = docRef.id
        return id;
    })
    .catch(error=> {
      return res.status(500).send(error.toString())
    })

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1100,
      height: 1200,
      deviceScaleFactor: 1,
    });

    console.log('going to ','https://invoicer-6022f.firebaseapp.com/view/'+id)

    await page.goto('https://invoicer-6022f.firebaseapp.com/view/'+id, {waitUntil: 'networkidle2'});
    const buffer = await page.screenshot({fullPage: true});

      // now make pdf 
      var doc = new pdfkit();

      var buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
          console.log('on end')
          let pdfData = Buffer.concat(buffers);

           //try to mail the Document
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

          // Added to make the invoice Name Unique
          const stamp = Date.now().toString();

          let mailOptions = {
            from: '"Invoicer.me" <support@invoicer.me>',
            to: toEmail,
            subject: `${name} has sent you an invoice`,
            attachments: [{
              filename: 'invoice-' + stamp + '.pdf',
              content: pdfData
            }],
            html: `Hello,<br> <p>${name} created an invoice on invoicer.me and has sent it to you for processing. Invoicer.me is an app that allows you to create invoices and send them to clients all around the world. </p> <p>If you feel you have recieved this invoice in error please contact us at support@invoicer.me</p><br><br>Thank you from invoicer. <br> ${message}`
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

    // add image and close pdf
    doc.scale(0.81).image(buffer, 0, 0, {fit: [800, 800]})
    doc.end();

    } catch (e) {
      console.log(e.toString())
      res.status(500).send(e.toString());
    }
    await browser.close();

  res.status(200).send({message: "Invoice created Successfully and an email was sent to " + toEmail})
  res.end()
})



exports.api = functions.runWith({ memory: '1GB', timeoutSeconds: 120 }).https.onRequest(app);


