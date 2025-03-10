const verifyEmailTemplate=({name,url})=>{
    return `
        <h1>Hello ${name},</h1>
        <p>Thank you for signing up with us. Please confirm your email by clicking the following link:</p>
        <a href=${url}>Confirm Email</a>
        <p>If you didn't sign up, please ignore this email.</p>
    `
}

export default verifyEmailTemplate;