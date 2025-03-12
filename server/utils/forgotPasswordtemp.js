const forgotPasswordTemp=({ name, otp, expireTime }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>You recently requested to reset your password. Use the OTP below to proceed:</p>
            <div style="text-align: center; font-size: 22px; font-weight: bold; background: #eee; padding: 10px; border-radius: 5px;">
                ${otp}
            </div>
            <p style="color: red;">This OTP is valid until ${new Date(expireTime).toLocaleString()}.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br/>Your Team</p>
        </div>
    `;
};

export default forgotPasswordTemp;