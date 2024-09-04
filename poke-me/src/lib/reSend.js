import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
console.log("Available methods on resend:", Object.keys(resend));
export default resend;
