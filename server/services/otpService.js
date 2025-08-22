export function generateOTP(length = 6) 
{
    const digits = '0123456789';
    let otp = '';

    for(let i=0 ; i<length ; i++) 
    {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

export function generateExpiry(minutes = 2) 
{
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}
