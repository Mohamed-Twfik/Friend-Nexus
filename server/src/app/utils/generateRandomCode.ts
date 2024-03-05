import crypto from 'crypto';

export default (length: number)=>{
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}