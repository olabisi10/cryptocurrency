const create_analkel_users = "INSERT INTO analkel_users(email,user_analkel_acctno,otp) VALUES ($1,$2,$3) RETURNING *"

const check_analkel_user_exist = `SELECT * FROM analkel_users  WHERE email=$1;`

const check_analkel_user_exist_profile = `SELECT phoneno  FROM analkel_users  WHERE phoneno=$1;`

const  check_analkel_username_exist_profile = `SELECT email FROM analkel_users  WHERE username=$1;`

const  get_analkel_user_profile_email  = `SELECT * FROM analkel_users  WHERE email=$1;`

module.exports = {
    create_analkel_users,
    check_analkel_user_exist,
    check_analkel_user_exist_profile,
    check_analkel_username_exist_profile,
    get_analkel_user_profile_email 
}