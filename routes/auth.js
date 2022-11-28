const bcrypt = require("bcryptjs");
const pool = require("../model/userdb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sgMail_Analkel_user = require("@sendgrid/mail");
const queries = require("./queries");
const otpGenerator = require("otp-generator");
const response = require("express");

const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

const { truncate } = require("fs");
const { Console } = require("console");

dotenv.config();

const regUsers = async (req, res) => {
  console.log("register !!!!");

  try {
    const email = req.body.email;
    //validation...of field to make sure it not empty...........
    if (!email) {
      return res.status(400).json({
        error: "Please enter fields.",
      });
    }

    ///Checking if user already exist.....By quering our DataBase......
    const client = await pool.connect();
    const data = await client.query(queries.check_analkel_user_exist, [email]);
    const user = data.rows;
    console.log(data);
    if (user.length != 0) {
      return res.status(400).json({
        error: "User already there, No need to register again.",
      });
    } else {
      ///Generate OTP

      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      console.log("otp", otp);
      //hash the otp
      const saltRounds = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp, saltRounds);

      //Generate User Account Details For Analkel
      const analkel_user_generate_acctno = `${Math.floor(
        1000000 + Math.random() * 9000
      )}`;
      const analkel_user_acctno = "AL" + analkel_user_generate_acctno;

      //Storing First level information of registring user details to analkel database before moving to the next step of registration
      const createdUser = await client.query(queries.create_analkel_users, [
        email,
        analkel_user_acctno,
        hashedOtp,
      ]);

      //returns a json response upon successful
      res.status(200).json({
        message: "successful",
        user: createdUser.rows[0],
      });

      console.log("HERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");

      sgMail_Analkel_user.setApiKey(process.env.Analkel_API_KEY);
      const sendMail = async (msg) => {
        try {
          await sgMail_Analkel_user.send(msg);
          console.log("Email sent", email);
        } catch (error) {
          console.log(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      };

      sendMail({
        to: email,
        from: process.env.Analkel_EMAIL_ADDRS,
        subject: "Analkel OTP details",
        html: `<p> <b>${otp}</b> please enter the otp in the app to complete registration<\p>`,
      });
    }
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
};

const verifyingOtp = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const client = await pool.connect();
  const data = await client.query(
    `SELECT * FROM analkel_users WHERE email = $1;`,
    [email]
  ); //Verifying if the user exists in the database
  const user = data.rows;

  if (user.length == 0) {
    return res.status(400).json({
      error: "user not found...",
    });
  }

  try {
    bcrypt.compare(otp, user[0].otp, (err, result) => {
      if (result === false) {
        res.status(200).json({
          message: "User OTP error",
        });
      } else if (result === true) {
        res.status(200).json({
          message: "User OTP verified....",

          user_login_id: user[0].user_id,
        });
      }
    });
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
};

const UsersSetUpProfile = async (req, res) => {
  try {
    const email = req.body.email;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const phoneno = req.body.phoneno;
    const pswd = req.body.pswd;

    //validation...of field to make sure it not empty...........

    if (!fname || !lname || !phoneno || !pswd) {
      return res.status(400).json({
        error: "Please enter all fields.",
      });
    }

    ///Checking if user already exist.....By quering our DataBase......

    const client = await pool.connect();
    const data = await client.query(queries.check_analkel_user_exist_profile, [
      phoneno,
    ]);
    const user = data.rows;
    console.log(data);

    if (user.length != 0) {
      return res.status(400).json({
        error: "User already there, No need to register again.",
      });
    } else {
      const client = await pool.connect();
      const data = await client.query(queries.get_analkel_user_profile_email, [
        email,
      ]);
      const user = data.rows;

      //console.log("Userprofile",user[0].email)

      const saltRounds = await bcrypt.genSalt(10);
      const hashedpswd = await bcrypt.hash(pswd, saltRounds);

      const userProfile = client.query(
        "UPDATE analkel_users SET  fname=$1,lname=$2,phoneno=$3,pswd=$4 Where email=$5",
        [fname, lname, phoneno, hashedpswd, user[0].email]
      );

      res.status(200).json({
        message: "Saved........",
        user_login_id: user[0].user_id,
      });

      res.status(200).json({
        message: "successful",
        user: userProfile.rows[0],
      });
    }
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
};

const UsersnameProfile = async (req, res) => {
  try {
    const username = req.body.username;

    //validation...of field to make sure it not empty...........

    if (!username) {
      return res.status(400).json({
        error: "Please enter field.",
      });
    }

    ///Checking if user already exist.....By quering our DataBase......
    const client = await pool.connect();
    const data = await client.query(
      queries.check_analkel_username_exist_profile,
      [username]
    );
    const user = data.rows;
    console.log(data);

    if (user.length != 0) {
      return res.status(400).json({
        error: "Username  already  exist.",
      });
    } else {
      const email = req.body.email;

      const client = await pool.connect();
      const data = await client.query(queries.get_analkel_user_profile_email, [
        email,
      ]);
      const user = data.rows;

      const userProfile = pool.query(
        "UPDATE analkel_users SET  username=$1  WHERE email=$2",
        [username, user[0].email]
      );
    }
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
};

const ResendOtp = async (req, res) => {
  const email = req.body.email;

  try {
    const client = await pool.connect();
    const data = await client.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]); //Verifying if the user exists in the database
    const user = data.rows;

    if (user.length == 0) {
      return res.status(400).json({
        error: "user not found...",
      });
    }

    ///Generate OTP

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp", otp);
    //hash the otp
    const saltRounds = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const pswd = await pool.query("UPDATE users SET otp = $1 ", [hashedOtp]);

    res.status(200).json({
      message: "done......",
      user_login_id: user[0].user_id,
    });

    sgMail_suber_user.setApiKey(process.env.SUBA_API_KEY);
    const message = {
      to: email,
      from: process.env.SUBA_EMAIL_ADDRS,
      subject: "Suba OTP details",
      html: `<p> Enter <b>${otp}</b> please enter the opt in the app to complete registration<\p>`,
    };
    sgMail_suber_user
      .send(message)
      .then((response) => console.log("Email was sent ..."))
      .catch((error) => console.log(error.message));
  } catch (error) {
    res.json(error.message);
    console.log(error.message);
  }
};

const del_users = async (req, res) => {
  const email = req.body.email;

  const client = await pool.connect();
  const data = await client.query(`DELETE FROM users WHERE email=$1;`, [email]); //deleting data..
  const user = data.rows;

  if (user.length != 0) {
    return res.status(400).json({
      error: "user  found...",
    });
  }

  try {
    res.status(200).json({
      message: "User deleted",
      data: {
        user_id: user[0],
      },
    });
    console.log("deleted........ 200k", createdUser.rows[0]);
  } catch (error) {
    res.json(error.message);
    console.log(error.message);
  }
};

const userLogin = async (req, res) => {
  const phoneno = req.body.username;
  const compswd = req.body.pswd;

  try {
    const data = await pool.query(`SELECT * FROM users WHERE phoneno = $1;`, [
      phoneno,
    ]); //Verifying if the user exists in the database
    const user = data.rows;
    console.log(user);
    if (user.length === 0) {
      res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    } else {
      bcrypt.compare(compswd, user[0].pswd, (err, result) => {
        //Comparing the hashed password
        if (err) {
          res.status(400).json({
            error: "Server error",
          });
        } else if (result === true) {
          //Checking if credentials match

          const token = jwt.sign(
            {
              phoneno: phoneno,
            },
            process.env.SECRET_KEY
          );

          res.status(200).json({
            message: "User signed in!",
            token: token,

            data: {
              user: user[0].user_id,
              fname: user[0].fname,
              lname: user[0].lname,
              username: user[0].fname,
              gender: user[0].gender,
              email: user[0].email,
              phoneno: user[0].phoneno,
              avatar: user[0].avatar,
              walletballance: user[0].walletballance,
              user_bankname: user[0].user_bankname,
              user_acctno: user[0].user_acctno,
              user_acctname: user[0].user_acctname,
              savings: user[0].savings,
              totalbalance: user[0].totalbalance,
              investment: user[0].investment,
              transaction_history: user[0].transaction_history,
              notification_from_suba: user[0].notification_from_suba,
              bvn_no: user[0].bvn_no,
              dob: user[0].dob,
              cardno: user[0].cardno,
              cardvalidThru: user[0].cardvalidThru,
              cardcvv: user[0].cardcvv,
            },
          });
        }
        console.log("successful 200k");
      });
    }
  } catch (err) {
    res.json(err.message);
    console.log(err.message);
  }
};

// // Get User Profile {picture,email,name}....
const getProfile = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      message: "Welcome",

      data: {
        fname: user[0].fname,
        lname: user[0].lname,
        email: user[0].email,
      },
    });
    console.log("successful 200k", createdUser.user[0]);
  } catch (err) {
    res.json(err.message);
  }
};

// // setbyour security question
const faq = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      message: "Welcome",

      data: {
        faq: user[0].faq,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

// //Admin  Dashboard
const userdashboardget = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      message: "Welcome",

      data: {
        username: user[0].fname,
        totalbalance: user[0].totalbalance,
        walletballance: user[0].walletballance,
        savings: user[0].savings,
        investment: user[0].investment,
        transaction_history: user[0].transaction_history,
        notification_from_suba: user[0].notification_from_suba,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const fundacct = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  const fundacct = req.body.fundacct;

  try {
    const _ = await pool.query(
      "UPDATE users SET walletballance = $1 WHERE user_id = $2",
      [fundacct, user[0].user_id]
    );

    res.status(200).json({
      message: "Sucessful",

      data: {
        username: user[0].fname,
        walletballance: user[0].walletballance,
        totalbalance: user[0].totalbalance,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const showuserDebitCard = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      data: {
        cardno: user[0].cardno,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const addDebitCard = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  const cardno = req.body.cardno;
  const cardvalidThru = req.body.cardvalidThru;
  const cardcvv = req.body.cardcvv;

  try {
    const _ = await pool.query(
      "UPDATE users SET cardno = $1, cardvalidThru = $2 cardcvv = $4 WHERE user_id = $5 ",
      [cardno, cardvalidThru, cardcvv, user[0].user_id]
    );

    res.status(200).json({
      message: "successfuly Added...",

      data: {
        username: user[0].fname,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const makeTransfer_showsuba_acct_detail = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      message: ".Kindly make transfer to the account details below....",

      data: {
        BankeName: "Access Bank",
        AccountNumber: "2134466789",
        AccountName: "Suba Capital",
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const increase_your_limitsget = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      data: {
        increase_limit:
          "Increase the limit by uploading your indentification documents 25% complete",
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const invite_a_friend = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      data: {
        invite: "Invite a friend..... and Earn",
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const create_a_planget = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      data: {
        invite: "Saving Goals.....",
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const start_saving_goalsget = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      data: {
        invite: "Saving Goals.....",
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const user_bank_settingspost = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  const user_bankname = req.body.bankname;
  const user_acctno = req.body.acctno;
  const user_acctname = req.body.acctname;

  try {
    const _ = await pool.query(
      "UPDATE users SET user_bankname = $1, user_acctno = $2, user_acctname = $3 WHERE user_id = $4",
      [user_bankname, user_acctno, user_acctname, user[0].user_id]
    );

    res.status(200).json({
      message: "Successful",
      data: {
        username: user[0].fname,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const user_bank_settingsget = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      data: {
        acctname: user[0].user_bankname,
        bankname: user[0].user_acctname,
        bankname: user[0].user_acctname,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

const trasactionHistory = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users WHERE phoneno= $1;`, [
    req.user.phoneno,
  ]);
  const user = data.rows;

  try {
    res.status(200).json({
      transact_data: {
        acctname: user[0].user_bankname,
        bankname: user[0].user_acctname,
        bankname: user[0].user_acctname,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

////BLOG Endpoints.....////

const regUsers_blog_admin = async (req, res) => {
  try {
    const admin_fname = req.body.admin_fname;
    const admin_lname = req.body.admin_lname;
    const admin_gender = req.body.admin_gender;
    const admin_phoneno = req.body.admin_phoneno;
    const admin_email = req.body.admin_email;
    const admin_password = req.body.admin_password;
    ///const {fname,lname,gender,phoneno,email} = req.body

    //validation...of field to make sure it not empty...........
    //   if(!admin_fname || !admin_lname || !admin_gender || !admin_phoneno || !admin_email){
    //     return  res.status(400).json({
    //         error: "Please enter all fileds.",
    //         });
    //   }

    //Checking if user already exist.....
    const client = await pool.connect();
    const data = await client.query(
      `SELECT * FROM users_admin_blog WHERE phoneno= $1;`,
      [admin_phoneno]
    );
    const user = data.rows;

    if (user.length != 0) {
      return res.status(400).json({
        error: "User already there, No need to register again.",
      });
    } else {
      /////Send Registering user email Notification

      sgMail_suber_user.setApiKey(process.env.SUBA_API_KEY);
      const message_noftification = {
        to: admin_email,
        from: process.env.SUBA_EMAIL_ADDRS,
        subject: "Verify User For Blog Posting",
        html: `<p> Hi <b>${admin_fname}, ${admin_lname}</b>  kindly wait for you to be verified by our admin<\p>`,
      };
      sgMail_suber_user
        .send(message_noftification)
        .then((response) => console.log("Blog verify Email was sent ..."))
        .catch((error) => console.log(error.message_noftification));

      console.log("HEREREReererer");

      const createdUser = await client.query(
        "INSERT INTO users_admin_blog(fname,lname,gender,phoneno,email,paswd) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          admin_fname,
          admin_lname,
          admin_gender,
          admin_phoneno,
          admin_email,
          admin_password,
        ]
      );

      ////Send Admin Notification.......

      const data = await client.query(
        `SELECT * FROM  users_admin_blog WHERE admin_id= 1;`
      );
      const user = data.rows;

      sgMail_suber_user.setApiKey(process.env.SUBA_API_KEY);
      const message_admin = {
        to: user[0].admin_email,
        from: process.env.SUBA_EMAIL_ADDRS,
        subject: "Verify User For Blog Posting",
        html: `<p> Please kindly verify user with following details for the  admin blog posting <b>${admin_fname}, ${admin_lname},${admin_gender}, ${admin_phoneno},${admin_email}</b><\p>`,
      };
      sgMail_suber_user
        .send(message_admin)
        .then((response) => console.log("Email was sent ..."))
        .catch((error) => console.log(error.message_admin));

      res.status(200).json({
        message: "successful",
        user: createdUser.rows[0],
      });
    }
  } catch (err) {
    res.json(err.message);
  }
};

const adminLoginblog = async (req, res) => {
  const admin_email = req.body.admin_email;
  const admin_pswd = req.body.admin_pswd;

  try {
    const data = await pool.query(
      `SELECT * FROM  users_admin_blog WHERE email = $1;`,
      [admin_email]
    ); //Verifying if the user exists in the database
    const user = data.rows;
    console.log(user);
    if (user.length === 0) {
      res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    } else {
      bcrypt.compare(admin_pswd, user[0].paswd, (err, result) => {
        //Comparing the hashed password
        if (err) {
          res.status(400).json({
            error: "Server error",
          });
        } else if (result === true) {
          //Checking if credentials match

          const token = jwt.sign(
            {
              admin_email: email,
            },
            process.env.SECRET_KEY
          );

          res.status(200).json({
            message: "User signed in!",
            token: token,

            data: {
              adminfname: user[0].fname,
              adminlname: user[0].lname,
              admingender: user[0].gender,
              adminphoneno: user[0].phoneno,
              adminemail: user[0].email,
              admincomments: user[0].comments,
            },
          });
        }
      });
    }
  } catch (err) {
    res.json(err.message);
  }
};

const blog_post = async (req, res) => {
  const client = await pool.connect();
  const data = await client.query(`SELECT * FROM users_comment_blog;`);
  const user = data.rows;

  const usernameblog = req.body.usernameblog;
  const useremailblog = req.body.useremailblog;
  const usercommentsblog = req.body.usercommentsblog;

  if (!usernameblog || !useremailblog || !usercommentsblog) {
    errors.push({ massage: "Please enter all fields" });
    res.json(errors);
  }

  try {
    //const _ = await pool.query("UPDATE comment_id SET username = $1,useremail = $2,usercomments = $3,WHERE comment_id = $4",[user[0].user_id] );

    const createdUser = await client.query(
      "INSERT INTO users_comment_blog(username,usercomments,useremail) VALUES ($1,$2,$3) RETURNING *",
      [usernameblog, useremailblog, usercommentsblog]
    );

    res.status(200).json({
      message: "Sucessful",

      data_blog: {
        usernameblog: user[0].username,
        useremailblog: user[0].useremail,
        usercommentsblog: user[0].usercomments,
      },
    });
  } catch (err) {
    res.json(err.message);
  }
};

//////.......Financial Calculation.....////////////

const calsavings_daily = async (req, res) => {
  let myDate = new Date();
  day = myDate.getDay();
  date = myDate.getDate();
  month = myDate.getMonth() + 1;
  year = myDate.getFullYear();
  hour = myDate.getHours();
  minutes = myDate.getMinutes();
  second = myDate.getSeconds();

  console.log(month);
};

const calsavings_weekly = async (req, res) => {
  let myDate = new Date();
  day = myDate.getDay();
  date = myDate.getDate();
  month = myDate.getMonth() + 1;
  year = myDate.getFullYear();
  hour = myDate.getHours();
  minutes = myDate.getMinutes();
  second = myDate.getSeconds();

  console.log(month);
};

const calsavings_monthly = async (req, res) => {
  let myDate = new Date();
  day = myDate.getDay();
  date = myDate.getDate();
  month = myDate.getMonth() + 1;
  year = myDate.getFullYear();
  hour = myDate.getHours();
  minutes = myDate.getMinutes();
  second = myDate.getSeconds();

  console.log(month);
};

module.exports = {
  regUsers,
  userLogin,
  verifyingOtp,
  UsersnameProfile,
  del_users,
  ResendOtp,
  UsersSetUpProfile,

  fundacct,
  showuserDebitCard,
  userdashboardget,
  getProfile,
  addDebitCard,
  makeTransfer_showsuba_acct_detail,
  user_bank_settingsget,
  user_bank_settingspost,
  start_saving_goalsget,
  increase_your_limitsget,
  create_a_planget,
  invite_a_friend,
  regUsers_blog_admin,
  adminLoginblog,
  blog_post,
  calsavings_daily,
};
