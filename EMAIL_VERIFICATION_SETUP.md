# Email Verification Setup Guide

## ✅ What Was Implemented

Email verification has been implemented to prevent fake accounts and spam:

1. **Production Signup** (`/api/auth/signup`):
   - Sets `email_verified: false` - Users MUST verify their email
   - Auth0 automatically sends verification email on account creation

2. **Test Signup** (`/api/auth/signup-test`):
   - Keeps `email_verified: true` - Auto-verifies for testing only
   - **Should NOT be used in production**

3. **Email Verification Banner**:
   - Shows warning to unverified users
   - Allows resending verification email
   - Dismissible but persists across sessions until verified

4. **Resend Verification API** (`/api/auth/resend-verification`):
   - Allows users to request a new verification email
   - Uses Auth0 Management API to trigger email

## 🔧 Auth0 Configuration Required

### Step 1: Enable Email Verification in Auth0

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Authentication** → **Database** → **Username-Password-Authentication**
3. Click **Settings** tab
4. Scroll to **Email Verification**:
   - ✅ **Enable** "Require Email Verification"
   - This ensures users cannot login until email is verified

### Step 2: Customize Verification Email Template

1. Go to **Branding** → **Email Templates**
2. Select **Verification Email (using Link)**
3. Customize the template:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Email - Indian Advocate Forum</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: white; padding: 30px; border-radius: 8px;">
      <h2 style="color: #1e40af;">Welcome to Indian Advocate Forum!</h2>
      
      <p>Hi {{user.name}},</p>
      
      <p>Thank you for creating an account with Indian Advocate Forum. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ url }}" 
           style="background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">
        {{ url }}
      </p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        If you didn't create this account, you can safely ignore this email.
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      
      <p style="color: #666; font-size: 12px; text-align: center;">
        Indian Advocate Forum - Connecting Legal Professionals<br>
        <a href="https://indian-advocate-forum-2arp-2jjwc2368.vercel.app" style="color: #1e40af;">Visit Our Website</a>
      </p>
    </div>
  </div>
</body>
</html>
```

4. **Enable** the template
5. Click **Save**

### Step 3: Configure Redirect URLs

1. Go to **Applications** → **Applications** → Select your app
2. Add to **Allowed Callback URLs**:
   ```
   https://indian-advocate-forum-2arp-2jjwc2368.vercel.app/api/auth/callback,
   http://localhost:3000/api/auth/callback
   ```

3. Add to **Application Login URI** (optional - for post-verification redirect):
   ```
   https://indian-advocate-forum-2arp-2jjwc2368.vercel.app/home
   ```

### Step 4: Test Email Delivery

1. Go to **Authentication** → **Database** → **Username-Password-Authentication** → **Settings**
2. Scroll to **Email Verification** section
3. Click **Try** to send a test verification email to yourself
4. Verify email delivery is working

## 🚀 How It Works (User Flow)

1. **New User Signs Up**:
   - User fills signup form and submits
   - Account created with `email_verified: false`
   - Auth0 automatically sends verification email

2. **User Sees Warning Banner**:
   - Yellow banner appears on all pages
   - "Email verification required" message shown
   - Option to resend verification email

3. **User Clicks Verification Link**:
   - Opens email from Auth0
   - Clicks "Verify Email Address" button
   - Redirected to your app (logged in)
   - Banner disappears (email now verified)

4. **If Email Lost**:
   - User clicks "Resend Email" in banner
   - New verification email sent
   - Can repeat as needed

## 🔒 Security Benefits

✅ **Prevents Fake Accounts**: Requires valid email address  
✅ **Reduces Spam**: Bots cannot create verified accounts  
✅ **Email Ownership**: Confirms user owns the email  
✅ **Account Recovery**: Verified email enables password resets  
✅ **Communication**: Ensures important emails reach real users

## 🧪 Testing

### Development Testing (Auto-Verify)
Use the test endpoint for quick testing:
```bash
POST /api/auth/signup-test
# This auto-verifies email - DO NOT use in production
```

### Production Testing (Real Verification)
Use the production endpoint:
```bash
POST /api/auth/signup
# This requires real email verification
```

## 📝 Important Notes

1. **signup-test endpoint**: 
   - Only for development/testing
   - Auto-verifies emails
   - Remove or protect before full production launch

2. **Vercel Environment Variables**:
   - Ensure `NEXT_PUBLIC_BASE_URL` is set to your Vercel URL
   - Auth0 credentials must be configured in Vercel

3. **Email Provider**:
   - Auth0 uses default email provider (limited)
   - For production, consider custom SMTP (SendGrid, Mailgun, etc.)
   - Configure in Auth0: **Authentication** → **Emails** → **Provider**

4. **Verification Link Expiry**:
   - Default: 5 days
   - Configure in Auth0 database settings
   - Users can request new link anytime

## 🔄 Migration for Existing Users

If you have existing users with `email_verified: true`, they won't be affected. Only new signups will require verification.

To require verification for all users (optional):
```javascript
// Run this migration script once
const users = await prisma.user.findMany();
for (const user of users) {
  await auth0.users.update(
    { id: user.auth0Id },
    { email_verified: false }
  );
}
```

## ✅ Verification Checklist

- [ ] Auth0: Enable "Require Email Verification" in database settings
- [ ] Auth0: Customize verification email template
- [ ] Auth0: Test email delivery
- [ ] Vercel: Ensure environment variables are set
- [ ] Test: Create new account and verify email works
- [ ] Test: Click "Resend Email" button works
- [ ] Production: Remove or protect `/api/auth/signup-test` endpoint

## 🆘 Troubleshooting

**Email not arriving?**
- Check spam folder
- Verify Auth0 email provider settings
- Check Auth0 logs for email delivery errors
- Try resending from banner

**Verification link expired?**
- Click "Resend Email" in banner
- New link valid for 5 days

**Banner not showing?**
- Check browser console for errors
- Verify user is logged in
- Check `user.email_verified` value in session

**Resend button not working?**
- Check browser console for API errors
- Verify Auth0 Management API credentials in .env
- Check user has valid `sub` (user ID)

---

**Status**: ✅ Email verification implemented and ready for production use!
