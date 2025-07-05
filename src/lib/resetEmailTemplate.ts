export function resetEmailTemplate(link: string, name: string) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Halo ${name},</h2>
      <p>Anda menerima email ini karena kami menerima permintaan untuk mereset password akun Anda di <strong>INDA BPS Sumut</strong>.</p>
      <p>Silakan klik tombol di bawah ini untuk mereset password Anda:</p>
      <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      <p style="margin-top: 40px;">Terima kasih,<br/>Tim INDA</p>
    </div>
  `;
}
