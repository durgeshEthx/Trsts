var express = require('express');
var router = express.Router();
var User = require('../models/user');
var upload = require('./upload');
const PDF2Pic = require("pdf2pic");
var watermark = require('dynamic-watermark');
var path = require('path');
var PDFImage = require("pdf-image").PDFImage;
var converter = require('office-converter')();
var md5 = require('md5');
var sizeOf = require('image-size');
const image2base64 = require('image-to-base64');
const fs = require('fs');
var request = require('request');
var nodemailer = require("nodemailer");
var Recaptcha = require('express-recaptcha').RecaptchaV3;
const userdetail = require('../models/userdetails');
//const TokenVerification = require('../models/tokenverification');
const Document = require('../models/document');
const contactus = require('../models/contact');
const billing = require('../models/billing');
const invoice = require('../models/invoice');
const payment = require('../models/payments');
const user_trsts_credit = require('../models/user_trsts_credits');
const user_address = require('../models/user_address');
// var flash = require('express-flash');
const support_replies = require('../models/support_replies');
const support = require('../models/support');
const user_money_wallet = require('../models/user_money_wallet');
const otp = require('../models/otp');
const wallet_address = require('../models/wallet_address');
const audit_trail = require('../models/audit_trail');
const signee = require('../models/signee');
const placeholder = require('../models/placeholders');
var recaptcha = new Recaptcha('6LegEqkUAAAAAM26uqgIyMEXH5ujQDY53okuRKgB', '6LegEqkUAAAAAC3G_m7NXeWTCIOPH0Gfk2CmVUbo', { callback: 'cb' });
var async = require('async');
/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "durgeshkmr4u@gmail.com",
		pass: "rnsqimcuthkawmnx"
	}
});

// function smtpconfig(){
//     var smtpTransport = nodemailer.createTransport({
// 	pool: true,
// 	host: "smtp.sparkpostmail.com",
// 	port: 587,
// 	secure: false,

// 	auth: {
// 	  user: "SMTP_Injection",
// 	  pass: "fc885621d357d99f241c14c1bd89b0b930046fd2"
// 	}
//   });

//   return smtpTransport;
// }
// var smtpTransport = nodemailer.createTransport({
// 	pool: true,
// 	host: "email-smtp.us-west-2.amazonaws.com",
// 	port: 465,
// 	secure: true, // use TLS
// 	auth: {
// 	  user: "AKIA4ZPU2O6CY3GZUWS3",
// 	  pass: "BCaWdRvL+gZjvYhATQM3wwbOVJ/ZZdRDDDml8+KABKCw"
// 	}
//   });
function genToken() {
	const crypto = require('crypto');
	return crypto.randomBytes(32).toString('hex');
}
var rand, mailOptions, host, link;
var code;
/*------------------SMTP Over-----------------------------*/

router.get('/', function (req, res, next) {
	generateEthereumKeyPair();
	return res.render('index0.ejs', { captcha: recaptcha.render() });
	//Swal.fire('Oops...', 'Something went wrong!', 'error')
});

function getClientIp(req) {
	var ipAddress;
	// The request may be forwarded from local web server.
	var forwardedIpsStr = req.header('x-forwarded-for');
	if (forwardedIpsStr) {
		// 'x-forwarded-for' header may return multiple IP addresses in
		// the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
		// the first one
		var forwardedIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if (!ipAddress) {
		// If request was not forwarded
		ipAddress = req.connection.remoteAddress;
	}
	return ipAddress;
};
router.post('/', function (req, res) {


	var personInfo = req.body;
	console.log('options ' + personInfo.country);
	//res.send({"Success":"password is not matched"});
	//!personInfo.username ||
	if (!personInfo.email || !personInfo.password || !personInfo.passwordConf) {

		res.send();// do something here.
	} else {

		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, function (err, data) {
				if (!data) {

					finddata(personInfo, req, res, data);
					// var data = sendMailForVerification(data, req, personInfo, res);


					//res.redirect('/');
					//res.render(('emailver.ejs'))
				} else {
					console.log('test1' + data);
					res.send({ success: 'ar' });
					p('after send')
					//res.render('index0.ejs', { username: personInfo.username, country: personInfo.country });
					//res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});
router.get('/dashboard', function (req, res) {

	// res.render('dashboard.ejs');
	p('your comapny ' + req.query.companyname);
	p('role ' + req.query.role);
	var username;

	if (req.query.companyname != undefined && req.query.role != undefined) {

		p('inside company');
		User.findOne({ email: req.session.email }, function (err, data) {
			if (data) {

				username = data.fullname;
				p('un ' + username);
				userdetail.findOne({ uid: data._id }, function (err, userd) {
					p('inside get');
					p(req.session.email);
					userd.company = req.query.companyname;
					userd.position = req.query.role;
					userd.save(function (err, res) {
						if (err) {
							p(err);
						} else {
							p(res);
						}
					});
					p('1')
					res.render('dashboard.ejs', { un: username, email_verified: 1, slick: 1, loggedrole: userd.company });
				});
			} else {
				p('2')
				res.render('dashboard.ejs', { un: username, email_verified: 1, slick: 0, loggedrole: '' });
			}
		});
	} else {
		p('session ' + req.session.email)
		User.findOne({ email: req.session.email }, function (err, data) {
			if (data) {
				username = data.fullname;

				userdetail.findOne({ uid: data._id }, function (err, userd) {


					if (userd.company != "" && userd.position != "") {
						p('3')
						p(userd.position);
						res.render('dashboard.ejs', { un: username, email_verified: 1, slick: 1, loggedrole: userd.position });
					} else {
						p('4')
						res.render('dashboard.ejs', { un: username, email_verified: 1, slick: 0, loggedrole: "" });
					}



				});

			}
			//res.render('dashboard.ejs',{un:username,email_verified:1,slick:0});
		});
		p('else');

	}

});

//upadtes the billing collection when plan not choosed
router.post('/dashboard', function (req, res) {
	p('plan-type ' + req.body.plantype);
	const planname = req.body.planname;
	const plantype = req.body.plantype;
	const start_date = Date.now();
	//const end_date = "";//Date.setDate(start_date + 30);
	//var newDate = new Date(start_date.setTime( start_date.getTime() + 30 * 86400000 ));
	User.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			var uid = data._id;
			p(uid);
			billing.findOne({ uid: uid }, function (err, billingPlans) {
				billingPlans.plan = planname;
				billingPlans.start_date = start_date;
				billingPlans.end_date = "";
				billingPlans.plan_type = plantype;
				billingPlans.status = 1;

				billingPlans.save(function (err, billing) {
					if (err) {
						p(err);
					} else {
						p(billing);
					}
				});
			});
			// if(data.email_verified == 1){
			//	res.render('dashboard.ejs',{un:data.fullname,email_verified:data.email_verified});
			// }
			username = data.fullname;

			userdetail.findOne({ uid: data._id }, function (err, userd) {

				p('userd company +' + userd.company)
				if (userd.company != "" && userd.position != "") {
					res.render('dashboard.ejs', { un: username, email_verified: 1, slick: 1, loggedrole: userd.company });
				} else {
					res.render('dashboard.ejs', { un: username, email_verified: 1, slick: 0, loggedrole: userd.company });
				}
			});
		}
	});

	//res.render('dashboard.ejs',{email_verified:1});
});
router.get('/plans', function (req, res) {
	const country = req.body.country;
	console.log('c' + country);
	var currency;
	User.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			var uid = data._id;
			userdetail.findOne({ uid: uid }, function (err, userde) {
				if (userde) {
					currency = userde.currency;
					res.render('plans.ejs', { country: currency });
				} else {

				}
			});
		} else {

		}
	});

});
router.get('/verify', function (req, res) {
	console.log(req.query.id + "&" + '');
	console.log(req.protocol + "://" + req.get('host'));

	verifyEmails(req, res);




	// if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
	// 	console.log("Domain is matched. Information is from Authentic email");
	// 	if (req.query.id == rand) {
	// 		console.log("email is verified"+req.query.id);
	// 		res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
	// 	}
	// 	else {
	// 		console.log("email is not verified");
	// 		res.end("<h1>Bad Request</h1>");
	// 	}
	// }
	// else {
	// 	res.end("<h1>Request is from unknown source");
	// }
});

router.get('/login', function (req, res, next) {

	return res.render('login0.ejs');
});

router.post('/login', function (req, res, next) {
	console.log(req.body);
	p('inside login');
	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			if (data.status == 1) {
				if (data.password == req.body.password) {
					//console.log("Done Login");
					req.session.userId = data.unique_id;
					//console.log(req.session.userId);
					req.session.email = req.body.email;
					res.send({ "Success": "Success!" });

				} else {
					res.send({ "Success": "Wrong password!" });
				}//
			} else {
				res.send({ 'status': '0' });
			}

		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

// to verify user for sining doc.
router.get('/verifyuserforsigning', function (req, res) {
	User.findOne({ email: req.query.email }, function (err, data) {

		if (data) {


			otp.findOne({ uid: data._id }, function (err, otps) {
				if (otps) {
					if (otps.code == req.query.link) {
						otps.code = "";
						res.render('sign.ejs'); 
					} else {
						res.send('error');
					}
				} else {
					p(err)
				}
			})

		} else {
			p(err)
		}
	});
});




// to send mail  for signing doc.

router.post('/sendmailforsignning', function (req, res) {
	var mail = 'durgeshkmr4u@gmail.com';
	var rand = md5('ethx' + genToken() + 'samlabs');
	link = "http://" + req.get('host') + "/verifyuserforsigning?id=" + rand + "&email=" + mail;

	//	var result = data.replace(/replaceurl/g, link);
	//	result = result.replace(/replacename/g, name);
	mailOptions = {
		//from: 'no-reply@trsts.co',
		to: mail,
		subject: "Invitation to sign Document",
		html: "<br><p>You have been invited to sign a document</p><a href=" + link + ">Click here to sign</a>"

	};
	//console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			res.end("error");
		}
		else {

			User.findOne({ email: mail }, function (err, data) {
				if (data) {
					otp.findOne({ uid: data._id }, function (err, otps) {
						otps.code = rand;
						otps.save();
					});


					res.send({ success: 'mail sent' });

				}

			});

		}
	});
})

router.get('/checkplans', function (req, res) {
	p('checkplans' + req.session.email);
	User.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			const uid = data._id;
			p(uid);
			billing.findOne({ uid: uid }, function (err, billingPlans) {
				if (billingPlans) {
					p(billingPlans.plan);
					if (billingPlans.plan == "" || billingPlans == null) {
						res.redirect('/plans');
					} else {
						res.redirect('/dashboard');
					}
				} else {
					p('plan collection not found');
				}
			});
		} else {
			p('user not found');
			res.send('user not found');
		}


	});
});
router.get('/profile', function (req, res, next) {
	//console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		//	console.log("data");
		//	console.log(data);
		if (!data) {
			res.redirect('/');

		} else {
			//console.log("found");
			userdetail.findOne({ uid: data._id }, function (err, userd) {


				if (userd.company != "" && userd.position != "") {
					//p('3')
					p(userd.position);
					//	res.render('dashboard.ejs',{un:username,email_verified:1,slick:1,loggedrole:userd.position});
					res.render('new_document.ejs', { loggedrole: userd.company, un: data.fullname, email: data.email });
				} else {
					res.render('new_document.ejs', { loggedrole: "", un: data.fullname, email: data.email });
				}



			});


		}
	});
});



router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.get('/forgetpass', function (req, res, next) {
	// res.render("resetpwd.ejs");
	res.render('forget0.ejs');
});
router.post('/reset', function (req, res) {
	var info = req.body;
	if (info.newpwd == info.cnfpwd) {
		User.findOne({ email: req.session.email }, function (err, data) {
			if (data) {
				data.password = info.newpwd;
				data.passwordConf = info.cnfpwd;
				data.save(function (err, result) {
					if (!err) {
						p('pwd updated');
					} else {
						p('pwd not updated');
					}
				});
			} else {

			}
		});
		res.redirect('/login');
	}
	else {
		res.render('resetpwd.ejs');
	}

});
router.get('/resetpassword', function (req, res) {
	res.render('resetpwd.ejs');
});
router.get('/verifypwdlink', function (req, res) {
	User.findOne({ email: req.query.email }, function (err, data) {

		if (data) {

			console.log(req.query.id);
			console.log(data.pwd_reset_code);
			if (req.query.id == data.pwd_reset_code) {
				res.session.email = req.query.email;
				console.log('code matched');
				data.pwd_reset_code = "";
				data.save(function (err, result) {

					res.redirect('/resetpassword');
				});
			} else {
				res.send('unauthorized user');
			}

		}
	});
});

// router.post('/forgetpass', function (req, res, next) {
// 	//console.log('req.body');
// 	//console.log(req.body);
// 	User.findOne({ email: req.body.email }, function (err, data) {
// 		console.log(data);
// 		if (!data) {
// 			res.send({ "Success": "This Email Is not regestered!" });
// 		} else {
// 			// res.send({"Success":"Success!"});
// 			if (req.body.password == req.body.passwordConf) {
// 				data.password = req.body.password;
// 				data.passwordConf = req.body.passwordConf;

// 				data.save(function (err, Person) {
// 					if (err)
// 						console.log(err);
// 					else
// 						console.log('Success');
// 					res.send({ "Success": "Password changed!" });
// 				});
// 			} else {
// 				res.send({ "Success": "Password does not matched! Both Password should be same." });
// 			}
// 		}req.body.plantype;
// 	});

// });
// router.get('/signd', function (req, res) {
// 	// res.send('clicked');
// 	//	 res.send(req.body.parkName);
// 	res.render('signd.ejs');
// });
router.get('/updateplaceholders', function (req, res) {

	const name = req.query.name;
	const count = req.query.count;
	const top = req.query.top;
	const left = req.query.left;
	var uid;
	User.findOne({ email: req.session.email }, function (err, data) {
		p('0')
		if (data) {
			p('1')
			uid = data._id;
			p('inside uid '+uid)
		}
		p('2')
		p('inside placeholder' + uid);
		if (name == 'X Signature') {
			p('count ' + count)
			if (count == 1) {// first time / replacement of same placeholder
				var placeholders = new placeholder({
					uid: uid,
				//	doc_id: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
					count: count,
					top: top,
					left: left,
					name: name
				});
				placeholders.save();
			}
		} else {
	
		}
	
		res.send({ 'sucess': 'updated' });
	});
	

});

router.post('/signd', function (req, res) {
	var info = req.body;
	var name = info.docdesc;
	console.log("MYname : " + name);
	p(req.session.email);
	//random strings
	const crypto = require('crypto');

	crypto.randomBytes(64, (err, buf) => {
		if (err) throw err;
		//	console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
	});

	const tmpimg = imgname + '_1.png';
	//console.log('tmpimg'+tmpimg);
	var paths = path.join(appRoot, 'images', tmpimg);
	const despath = path.join(appRoot, 'views', 'images', imgname);
	var dimensions = sizeOf(paths);
	//console.log(dimensions.width, dimensions.height);
	//console.log(md5('smlabs' + Date.now() + 'ethx'));
	//create watermark in image
	//console.log(__dirname);
	const waterMark = md5('smlabs' + Date.now() + 'ethx');
	var optionsTextWatermark = {
		type: "text",
		text: waterMark, // This is optional if you have provided text Watermark
		destination: despath + '.png',
		source: paths,
		position: {
			logoX: dimensions.width - 220,
			logoY: dimensions.height - 60,
			logoHeight: 100,
			logoWidth: 100
		},
		textOption: {
			fontSize: 10, //In px default : 20
			color: '#AAF122' // Text color in hex default: #000000
		}
	};
	var imgpath = path.join('images', imgname);
	imgpath = imgpath + '.png';
	//optionsImageWatermark or optionsTextWatermark
	watermark.embed(optionsTextWatermark, function (status) {
		//Do what you want to do here
		console.log(status);

		//......//


		// for logged in user
		var uid4doc;
		User.findOne({ email: req.session.email }, function (err, data) {
			if (data) {
				p('data ' + data._id)
				uid4doc = data._id;

				p('logged user _id ' + req.session.email);
				p(uid4doc)
				var document = new Document({
					uid: uid4doc,
					trstsid: waterMark,
					title: info.doctitle,
					comments: info.docdesc,
					location: despath + '.png',
					date: Date.now(),
					ip: getClientIp(req),
					status: 1,
				});
				//	document.save(function (err, doc) {
				// if (err) {
				// 	p(err);
				// } else {
				// 	//p(doc);
				// }
				document.save();
				p('insave');
				// if signeer is registered...
				//createAndRegisterSignee(info, document, req, res);
				wrapCreate(info, document, req, res);



				//});


			}
			else {
				p('not found 0 ' + err);
				uid4doc = "";
			}
		});
	});







	res.render('prepare.ejs', { imgpath: imgpath, docname: info.doctitle, docdesc: info.docdesc, trstsID: waterMark });
	//res.render('signd.ejs',{ imgpath: imgpath,name:name});//{ imgpath: imgpath, name: name }      
});

//any format -> pdf -> png
router.post('/upload', function (req, res) {
	console.log('approot' + appRoot);

	upload(req, res, (error) => {
		if (error) {

			console.log('ERROR ' + error.field);
			// res.redirect('/profile');
			//  res.render('sign_document.ejs');
		} else {
			if (req.file == undefined) {
				console.log(here);
				//res.redirect('/profile');
				//res.render('sign_document.ejs');

			} else {
				var filename = path.basename(path.join(appRoot, 'public', 'files', req.file.originalname), path.extname(req.file.originalname));
				global.imgname = filename;
				console.log(imgname);
				//	   console.log(req.file.originalname);
				const pdf2pic = new PDF2Pic({
					density: 100,           // output pixels per inch
					savename: filename,   // output file name
					savedir: "./images",    // output file location
					format: "png",          // output file format
					size: 600               // output size in pixels
				});



				pdf2pic.convertBulk(path.join(appRoot, 'public', 'files', req.file.originalname), -1).then((resolve) => {
					console.log("image converter successfully!");

					return resolve;
				});






				/**
				 * Create new record in mongoDB
				 */
				//   var fullPath = "files/"+req.file.filename;

				//   var d = {
				// 	path:     fullPath

				//   };

				// var doc = new Document(d); 

				// doc.save(function(error){
				//   if(error){ 
				// 	throw error;
				//   } 
				// 	res.render('sign_document.ejs');
				//  });
			}

		}
	});
	//res.redirect('back');
});

router.post('/forgetpass', function (req, res) {
	console.log('yess' + req.body.email);
	//	req.flash("info", "Email queued");
	User.findOne({ email: req.body.email }, function (err, data) {
		if (!data) {
			console.log('not reg');
			res.render('forget0.ejs', { error: 'error' });
		} else {
			console.log('reg...');
			const name = data.fullname;
			sendMail(req, res, name);
		}
	});

});

//send emails 4 signneer

router.post('/sendforsign', function (req, res) {

	User.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			p('sendforsign');
			var uid = data._id;
			p(uid)
			Document.findOne({ uid: uid }, function (err, doc) {
				p(doc);
				if (doc) {

					var doc_id = doc._id;
					p('doc id ' + doc_id)
					signee.findOne({ document_id: doc_id }, function (err, signer) {
						if (signer) {
							p('signeer ' + signee);
							var _uid = signer.signee_uid;
							p(_uid)
							User.find({ _id: _uid }, function (err, signeremail) {
								p('signeremail '+signeremail)
								p(err)
								res.send('signee')
							});
						} else {
							p(err)
							p('111')
							res.send('err');
						}
					})
				} else {
					p('12')
				}
			});

		} else {
			p('13')
		}
	});
});
router.post('/contactus', function (req, res) {
	console.log("company name " + req.session.email);

	const info = req.body;

	//check if user exists with email.

	User.findOne({ email: req.session.email }, function (err, data) {

		if (data) {
			console.log(data._id);
			var contact = new contactus({
				uid: data._id,
				// email:req.session.email,
				company: info.companyName,
				jobTitle: info.jobTitle,
				employees: info.employeeCount,
				phone: info.phone,
				skype: info.skype,

				ip: getClientIp(req),
				status: 1
			});

			contact.save(function (err, contact) {
				if (err) {
					console.log('contacts err ' + err);
				} else {
					console.log('contacts sucess');
				}
			});
			p('hhhh')
			//	res.redirect('/plans');
			res.send({ success: 'Your query has been taken we will get back to you very soon, till then please check our Enterprise plan' });

		}
		else {
			//	res.redirect('/plans');
			res.send({ fail: 'please fill out all fields' });
		}
		p('hereee')
	});
	//res.redirect('/plans');
});


module.exports = router;

async function wrapCreate(info, document, req, res) {
	await createUserforSign(info.signname, info.signemail, document, req, res);
	p('mid');
	await createUserforSign(info.secname, info.secemail, document, req, res);
	const count = info.count;
	p('coutn' + count);
	for (var i = 1; i <= count; i++) {
	//	p('count ' + i);
		await createUserforSign(info.name + i, info.email + i, document, req, res);
		// if (getUser_id(info.email + i)) {
		// 	var uid = getUser_id(info.email + i);
		// 	createSignee(document._id, uid);
		// }
		// else {
		// 	registerUser(info.name + i, info.email + i, req, res);
		// 	var uid = getUser_id(info.email + i);
		// 	createSignee(document._id, uid);
		// }
	}
}


async function createUserforSign(name, email, document, req, res) {
	p(email)
	await User.findOne({ email: email }, function (err, datas) {
		if (datas) {
			p('data id' + datas._id);
			// expand createSignee fx.
			var signees = new signee({
				document_id: document._id,
				signee_uid: datas._id,
				status: 2
			});
			signees.save();
			// signees.save(function (err, signee) {
			// 	if (err) {
			// 		p(err);
			// 	}
			// 	else {
			// 	//	p(signee);
			// 	}
			// });
		}
		else {
			p('else ' + err)
			registerUser(name, email, req, res);
			User.findOne({ email: email }, function (err, e) {
				if (e) {
					var u = e._id;
					createSignee(document._id, u);
				}
			});
		}
		p('err ' + err)
	});
}

function createAndRegisterSignee(info, document, req, res) {
	if (getUser_id(info.signemail) != "") {
		var uid = getUser_id(info.signemail);
		createSignee(document._id, uid);
	}
	else {
		registerUser(info.signname, info.signemail, req, res);
		var uid = getUser_id(info.signemail);
		createSignee(document._id, uid);
	}





	if (getUser_id(info.secemail) != "") {
		var uid = getUser_id(info.secemail);
		createSignee(document._id, uid);

	}
	else {
		registerUser(info.secname, info.secemail, req, res);
		var uid = getUser_id(info.secemail);
		createSignee(document._id, uid);
	}
	const count = info.count;
	p(count);
	for (var i = 1; i <= count; i++) {
	//	p('count ' + i);
		if (getUser_id(info.email + i)) {
			var uid = getUser_id(info.email + i);
			createSignee(document._id, uid);
		}
		else {
			registerUser(info.name + i, info.email + i, req, res);
			var uid = getUser_id(info.email + i);
			createSignee(document._id, uid);
		}
	}
}

function createSignee(id, uid) {
	p('uid ' + uid);

	var signees = new signee({
		document_id: id,
		signee_uid: uid,
		status: 2
	});
	signees.save(function (err, signee) {
		if (err) {
			p(err);
		}
		else {
			p(signee);
		}
	});
	return signees;
}

function registerUser(name, email, req, res) {
	var c;
	User.findOne({}, function (err, data) {
		if (data) {
			c = data.uid + 1;
		}
		else {
			c = 1;
		}
		p('user registered')
		rand = genToken(); // gen code for email code url.
		console.log('rand ' + md5('ethx' + rand + 'smlabs'));
		code = md5('ethx' + rand + 'smlabs');
		//	global.ec = emailcode;
		var newPerson = new User({
			uid: c,
			email: email,
			fullname: name,
			password: "",
			passwordConf: "",
			email_code: code,
			email_verified: 0,
			Date: Date.now(),
			ip: getClientIp(req),
			status: 2,
			pwd_reset_code: "",
		});
		newPerson.save(function (err, Person) {
			if (err) {
				console.log('newperson' + err);
			}
			else
				console.log(' newperson Success');
		});
		var userdetails = new userdetail({
			//unique_id: c, 
			uid: newPerson._id,
			//	_id:c,
			country: "",
			currency: "",
			mobile: "",
			company: "",
			position: "",
			status: ""
		});
		userdetails.save(function (err, details) {
			if (err) {
				console.log('details ' + err);
			}
			else
				// userdetail.find({})
				// .populate('uid')
				// .exec(function(err,userdetail){
				// 	console.log(userdetail._id);
				// });
				console.log('Success');
		});
		// create collection for billing , invoice , payment
		var billings = new billing({
			uid: newPerson._id,
			plan: "",
			start_date: "",
			end_date: "",
			plan_type: "",
			status: ""
		});
		billings.save(function (err, billing) {
			if (err) {
				p('err' + err);
			}
			else {
				//	p('billing ' + billing);
			}
		});
		var payments = new payment({
			uid: newPerson._id,
			invoice_id: "",
			payment_method: "",
			total: "",
			currency: "",
			transaction_id: "",
			status: ""
		});
		payments.save(function (err, payment) {
			if (err) {
				p('payment err' + err);
			}
			else {
				//	p('payment' + payment);
			}
		});
		var invoices = new invoice({
			uid: newPerson._id,
			plan: "",
			description: "",
			amount: "",
			tax: "",
			total: "",
			currency: "",
			status: ""
		});
		invoices.save(function (err, invoice) {
			if (err) {
				p('invoce err' + invoice);
			}
			else {
				//	p('invoice' + invoice);
			}
		});
		var user_trsts_credits = new user_trsts_credit({
			uid: newPerson._id,
			credits: "",
			status: ""
		});
		user_trsts_credits.save(function (err, user_trsts_credit) {
			if (err) {
				p('user_credit_err ' + err);
			}
			else {
				//	p('user_credit ' + user_trsts_credit);
			}
		});
		//user_address
		var user_addresss = new user_address({
			uid: newPerson._id,
			address1: "",
			address2: "",
			city: "",
			state: "",
			country: "",
			zip: "",
			status: ""
		});
		user_addresss.save(function (err, user_address) {
			if (err) {
				p('user_add err' + err);
			}
			else {
				//p('user_add ' + user_address);
			}
		});
		//support replies
		var support_replie = new support_replies({
			support_id: "",
			uid: newPerson._id,
			admin_id: "",
			body: "",
			date: "",
			ip: "",
			status: ""
		});
		support_replie.save(function (err, support_replie) {
			if (err) {
				p('support reples err' + err);
			}
			else {
				//p('support replie ' + support_replie);
			}
		});
		//support
		var supports = new support({
			uid: newPerson._id,
			subject: "",
			body: "",
			date: Date.now(),
			ip: getClientIp(req),
			is_admin: "",
			status: ""
		});
		supports.save(function (err, support) {
			if (err) {
				p(err);
			}
			else {
				//p(support);
			}
		});
		// user money wallet
		var user_money_wallets = new user_money_wallet({
			uid: newPerson._id,
			amount: "",
			currency: "",
			status: ""
		});
		user_money_wallets.save(function (err, user_money_wallet) {
			if (err) {
				p(err);
			}
			else {
				//p(user_money_wallet);
			}
		});
		//otp
		var otps = new otp({
			uid: newPerson._id,
			code: "",
			date: "",
			ip: "",
			status: ""
		});
		otps.save(function (err, otp) {
			if (err) {
				p(err);
			}
			else {
				//p(otp);
			}
		});
		//wallet_address
		var wallet_addresss = new wallet_address({
			uid: newPerson._id,
			address: "",
			status: ""
		});
		wallet_addresss.save(function (err, wallet_address) {
			if (err) {
				p(err);
			}
			else {
				//p(wallet_address);
			}
		});
		//sendMailForVerification(data, req, personInfo, res);
	}).sort({ _id: -1 }).limit(1);
}

function getUser_id(email) {
	p('email id ' + email);
	User.findOne({ email: email }, function (err, data) {
		if (data) {
			p('data ' + data._id)
			return data._id;
		}
		else {
			p('not found 0 ' + err);
			return "";
		}
	});
	//	p('not found 1')
}

function sendMailForVerification(data, req, personInfo, res) {
	console.log('code ' + code);
	// request.post(
	// 	'https://www.google.com/recaptcha/api/siteverify',
	// 	{ json: { key: 'value' } },
	// 	function (error, response, body) {
	// 		if (!error && response.statusCode == 200) {
	// 			console.log(body);
	// 		}
	// 	}
	// );
	//res.send({"Success":"You are regestered,You can login now."});
	// g-recaptcha-response is the key that browser will generate upon form submit.
	//	if its blank or null means user has not selected the captcha, so return the error.
	// console.log('req.body ' + personInfo.passwordConf);
	// console.log(req.body['g-recaptcha-response-v3']);
	//       if(req.body['g-recaptcha-response-v3'] === undefined || req.body['g-recaptcha-response-v3'] === '' || req.body['g-recaptcha-response-v3'] === null) {
	//         return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
	//       }
	//       // Put your secret key here.	
	//       var secretKey = "6LegEqkUAAAAAC3G_m7NXeWTCIOPH0Gfk2CmVUbo​";
	// //       // req.connection.remoteAddress will provide IP address of connected user.
	//       var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response-v3'] + "&remoteip=" + req.connection.remoteAddress;
	// 	  var clientServerOptions = {
	// 		uri: verificationUrl,
	// 		body: JSON.stringify(''),
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	}
	// 	request(clientServerOptions, function (error, response) {
	// 		//console.log(error,response.body);
	// 		return;
	// 	});
	// request.post( { headers: {'content-type' : 'application/json'} ,
	// 		verificationUrl,
	// 		function (error, response, body) {
	// 			if (!error && response.statusCode == 200) {
	// 				console.log("score"+body.score);
	// 			}
	// 			else{
	// 				console.log('reqerrir '+response.statusCode);
	// 			}
	// 		}
	// });
	//       // Hitting GET request to the URL, Google will respond with success or error scenario.
	//       request(verificationUrl,function(error,response,body) {
	//         body = JSON.parse(body);
	//         console.log('inside req'+body);
	//         // Success will be true or false depending upon captcha validation.
	//         if(body.success !== undefined && !body.success) {
	//           return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
	//         }
	//         console.log("ReCaptcha score: " + body.score);
	//         if(body.score >= 0.5) {
	//           console.log("body score"+body.score);
	//          // chaptcha_v3 = false;
	//           // Reload code here
	// 		 // res.sendFile(__dirname + '/index_v2.html');
	// 		 res.redirect('/login');
	// 		}
	// 		else{
	// 			console.log("body score"+body.score);
	// 		}
	// });
	const fp = appRoot + '/views/ui/email_activate.html';
	var data = fs.readFileSync(fp, 'utf8');
	host = req.get('host');
	link = "http://" + req.get('host') + "/verify?id=" + code + "&email=" + personInfo.email;
	console.log('link ' + code);
	var result = data.replace(/replacemee/g, link);
	result = result.replace(/replacename/g, personInfo.username);
	mailOptions = {
		// from:'no-reply@trsts.co',
		to: personInfo.email,
		subject: "Please confirm your Email account",
		html: "" + result + "<br>or<a href=" + link + ">Click here to verify</a>"
	};
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			//	console.log(error);
			res.end("error " + error);
		}
		else {
			console.log("Message sent: " + response.message);
			//res.end("sent");
			//console.log('swal');
			// res.redirect('/login');
			req.session.email = personInfo.email;
			p('senttt')
			res.send({ success: 'registered successfully !' });
			//res.redirect('/plans');
			//	res.send({ country: personInfo.country });
			//	res.render('plans.ejs',{country:personInfo.country});
		}
	});
	return data;
}

// ('/')
function finddata(personInfo, req, res, data) {
	var c;
	User.findOne({}, function (err, data) {
		if (data) {
			c = data.uid + 1;
		}
		else {
			c = 1;
		}
		rand = genToken(); // gen code for email code url.
		console.log('rand ' + md5('ethx' + rand + 'smlabs'));
		code = md5('ethx' + rand + 'smlabs');

		//	global.ec = emailcode;
		var newPerson = new User({
			uid: c,
			email: personInfo.email,
			fullname: personInfo.username,
			password: personInfo.password,
			passwordConf: personInfo.passwordConf,
			email_code: code,
			email_verified: 0,
			Date: Date.now(),
			ip: getClientIp(req),
			status: 1,
			pwd_reset_code: "",

		});
		newPerson.save(function (err, Person) {
			if (err) {
				console.log('newperson' + err);
			}
			else
				console.log('Success');
		});
		// logic for curr
		const country = personInfo.country;
		var curr;
		if (country === 'IN') {
			curr = 'INR';
		}
		else {
			curr = 'USD';
		}
		var userdetails = new userdetail({
			//unique_id: c, 
			uid: newPerson._id,
			//	_id:c,
			country: personInfo.country,
			currency: curr,
			mobile: "",
			company: "",
			position: "",
			status: ""
		});
		userdetails.save(function (err, details) {
			if (err) {
				console.log('details ' + err);
			}
			else
				// userdetail.find({})
				// .populate('uid')
				// .exec(function(err,userdetail){
				// 	console.log(userdetail._id);
				// });
				console.log('Success');
		});

		// create collection for billing , invoice , payment
		var billings = new billing({
			uid: newPerson._id,
			plan: "",
			start_date: "",
			end_date: "",
			plan_type: "",
			status: ""
		});
		billings.save(function (err, billing) {
			if (err) {
				p('err' + err);
			} else {
				p('billing ' + billing);
			}
		});

		var payments = new payment({
			uid: newPerson._id,
			invoice_id: "",
			payment_method: "",
			total: "",
			currency: "",
			transaction_id: "",
			status: ""
		});

		payments.save(function (err, payment) {
			if (err) {
				p('payment err' + err);
			} else {
				p('payment' + payment);
			}
		});

		var invoices = new invoice({
			uid: newPerson._id,
			plan: "",
			description: "",
			amount: "",
			tax: "",
			total: "",
			currency: "",
			status: ""
		});
		invoices.save(function (err, invoice) {
			if (err) {
				p('invoce err' + invoice);
			} else {
				p('invoice' + invoice);
			}
		});

		var user_trsts_credits = new user_trsts_credit({
			uid: newPerson._id,
			credits: "",
			status: ""
		});

		user_trsts_credits.save(function (err, user_trsts_credit) {
			if (err) {
				p('user_credit_err ' + err);
			} else {
				p('user_credit ' + user_trsts_credit);
			}
		});

		//user_address
		var user_addresss = new user_address({
			uid: newPerson._id,
			address1: "",
			address2: "",
			city: "",
			state: "",
			country: "",
			zip: "",
			status: ""
		});
		user_addresss.save(function (err, user_address) {
			if (err) {
				p('user_add err' + err);
			} else {
				p('user_add ' + user_address);
			}
		});
		//support replies
		var support_replie = new support_replies({
			support_id: "",
			uid: newPerson._id,
			admin_id: "",
			body: "",
			date: "",
			ip: "",
			status: ""
		});
		support_replie.save(function (err, support_replie) {
			if (err) {
				p('support reples err' + err);
			} else {
				p('support replie ' + support_replie);
			}
		});

		//support

		var supports = new support({
			uid: newPerson._id,
			subject: "",
			body: "",
			date: Date.now(),
			ip: getClientIp(req),
			is_admin: "",
			status: ""
		});

		supports.save(function (err, support) {
			if (err) {
				p(err);
			} else {
				p(support);
			}
		});
		// user money wallet
		var user_money_wallets = new user_money_wallet({
			uid: newPerson._id,
			amount: "",
			currency: "",
			status: ""
		});

		user_money_wallets.save(function (err, user_money_wallet) {
			if (err) {
				p(err);

			} else {
				p(user_money_wallet);
			}
		});

		//otp
		var otps = new otp({
			uid: newPerson._id,
			code: "",
			date: "",
			ip: "",
			status: ""
		});

		otps.save(function (err, otp) {
			if (err) {
				p(err);
			} else {
				p(otp);
			}
		});
		//wallet_address
		var wallet_addresss = new wallet_address({
			uid: newPerson._id,
			address: "",
			status: ""
		});
		wallet_addresss.save(function (err, wallet_address) {
			if (err) {
				p(err);
			}
			else {
				p(wallet_address);
			}
		});


		sendMailForVerification(data, req, personInfo, res);

	}).sort({ _id: -1 }).limit(1);



}
//email verifications
function verifyEmails(req, res) {
	User.findOne({ email: req.query.email }, function (err, data) {
		p('verify');
		if (data) {
			//console.log(data);
			if (data.email_verified == 0) {
				console.log(req.query.id);
				console.log(data.email_code);
				if (req.query.id == data.email_code) {
					console.log('code matched');
					data.email_verified = 1;
					data.email_code = "";
					data.save(function (err, result) {
						if (err) {
							p(err);
						} else {
							// if(res.session.email != ""){
							// 	p(res.session.email);
							// }else{
							// 	p(res.session.email);
							// }
							console.log('saved');
							res.redirect('/login');
						}

					});
				} else {
					res.send('unauthorized user');
				}
			}
			else {
				//res.redirect('/login');
				res.send('Email already verified, please login to continue ');
			}
		}
		else {
			p('err ' + err);
		}
	});
}

function sendMail(req, res, name) {
	const fp = appRoot + '/views/ui/email_recovery.html';
	var data = fs.readFileSync(fp, 'utf8');
	var rand;
	// Invoke the next step here however you like
	//console.log('text' + text);   // Put all of the code here (not the best solution)
	const crypto = require('crypto');
	// crypto.randomBytes(64, (err, buf) => {
	// 	if (err) throw err;
	// 	console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
	// 	random = buf.toString('hex');
	// });
	//rand = crypto.randomBytes(32).toString('hex'); //Math.floor((Math.random() * 100) + 54);

	//host = req.get('host');
	rand = md5('ethx' + genToken() + 'samlabs');
	link = "http://" + req.get('host') + "/verifypwdlink?id=" + rand + "&email=" + req.body.email;
	//console.log('rand' + link);
	//global.rand = rand;
	var result = data.replace(/replaceurl/g, link);
	result = result.replace(/replacename/g, name);
	mailOptions = {
		//from: 'no-reply@trsts.co',
		to: req.session.email,
		subject: "Reset Password",
		html: result
		// html: result + "<br>or<a href=" + link + ">Click here to verify</a>"
	};
	//console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			res.end("error");
		}
		else {
			//	console.log("Message sent: " + response.message);
			//res.end("sent");
			//console.log('swal');
			User.findOne({ email: req.body.email }, function (err, data) {
				if (data) {
					data.pwd_reset_code = rand;
					data.save(function (err, result) {
						p('value saved');
						res.redirect('/login');
					});
				} else {

				}


			});

		}
	});
}

function p(param) {
	console.log(param);
}
function generateEthereumKeyPair() {
	var Wallet = require('ethereumjs-wallet');
	const wallet = Wallet.generate();
	console.log("privateKey: " + wallet.getPrivateKeyString());
	console.log("address: " + wallet.getAddressString());
}