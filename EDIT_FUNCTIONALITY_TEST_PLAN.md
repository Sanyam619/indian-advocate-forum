# Edit Functionality - Complete Test Plan

## ✅ Test Status: READY FOR MANUAL TESTING

All edit functionality has been **implemented and verified**. This document provides a comprehensive testing checklist.

---

## 🎯 Overview

The application supports full CRUD operations for:
1. **News Articles** (inline editing)
2. **Judges** (dedicated edit page)
3. **Team Members** (dedicated edit page)
4. **Podcasts** (dedicated edit page)

---

## 📋 Pre-Testing Checklist

### ✅ Code Verification (COMPLETED)
- [x] Edit API endpoints exist for all entities
- [x] Edit pages support edit mode detection
- [x] Admin panel has Edit buttons for all entities
- [x] Form data fetching implemented
- [x] Form data pre-population implemented
- [x] API integration uses correct endpoints (PUT method)

---

## 🧪 Manual Testing Guide

### Setup Requirements
1. **Admin Access**: Log in with an admin account
2. **Test Data**: Ensure you have existing records to edit
3. **Cloudinary**: Have Cloudinary URLs ready for image/video uploads

---

## 1️⃣ Test News Article Editing

### Test Location
- Navigate to: `/admin-panel`
- Scroll to: **News Section**

### Test Steps
1. **Locate Edit Button**
   - Find any news article in the list
   - Click the **Edit** button (pencil icon)
   - ✅ Expected: Inline edit form appears with pre-filled data

2. **Verify Pre-filled Data**
   - ✅ Title field shows current title
   - ✅ Content field shows current content
   - ✅ Category dropdown shows current category
   - ✅ Image URL shows current image (if exists)
   - ✅ Video URL shows current video (if exists)

3. **Make Changes**
   - Change title to: "Test Edit - [Original Title]"
   - Modify content slightly
   - Change category if desired
   - Update image/video URLs (optional)

4. **Submit Changes**
   - Click **Update News Article** button
   - ✅ Expected: Success message appears
   - ✅ Expected: Changes persist after page refresh

5. **Validation Tests**
   - Try submitting with empty title
   - ✅ Expected: Error message shown
   - Try invalid Cloudinary URL
   - ✅ Expected: Validation error shown

### API Endpoint Test
- **Endpoint**: `PUT /api/admin/edit-news`
- **Required Fields**: newsId, title, content, category
- **Optional Fields**: imageUrl, videoUrl, videoThumbnail, courtName, tags, hasVideo
- **Validation**: Cloudinary URL format for images/videos

---

## 2️⃣ Test Judge Editing

### Test Location
- Navigate to: `/admin-panel`
- Scroll to: **Judges Section**

### Test Steps
1. **Click Edit Button**
   - Find any judge in the list
   - Click the **Edit** button
   - ✅ Expected: Redirects to `/admin/add-judge?id=[judgeId]`

2. **Verify Page Load**
   - ✅ Expected: Page title shows "Edit Judge"
   - ✅ Expected: JSON editor loads with existing judge data
   - ✅ Expected: All fields pre-populated

3. **Verify Pre-filled Data**
   - ✅ name field populated
   - ✅ fullName field populated
   - ✅ designation/position populated
   - ✅ court field populated
   - ✅ image/photoUrl populated
   - ✅ All optional fields (education, biography, etc.) populated if exist

4. **Make Changes**
   - Update judge name
   - Modify designation
   - Change court if needed
   - Update image URL (must be Cloudinary URL)

5. **Submit Changes**
   - Click **Update Judge** button
   - ✅ Expected: Success message appears
   - ✅ Expected: Redirects to admin panel after ~1.5 seconds
   - ✅ Expected: Changes visible in judges list

6. **Validation Tests**
   - Try invalid JSON format
   - ✅ Expected: JSON validation error
   - Try non-Cloudinary image URL
   - ✅ Expected: Validation error shown

### API Endpoint Test
- **Endpoint**: `PUT /api/admin/edit-judge`
- **Required Fields**: judgeId, judgeData (object)
- **Judge Data Fields**: name, fullName, designation, court, photoUrl
- **Optional Fields**: appointmentDate, retirementDate, dateOfBirth, education[], biography, specializations[], careerHighlights[], notableJudgments[], type, status, category
- **Validation**: Cloudinary URL for image field

---

## 3️⃣ Test Team Member Editing

### Test Location
- Navigate to: `/admin-panel`
- Scroll to: **Team Members Section**

### Test Steps
1. **Click Edit Button**
   - Find any team member in the list
   - Click the **Edit** button
   - ✅ Expected: Redirects to `/admin/add-team-member?id=[memberId]`

2. **Verify Page Load**
   - ✅ Expected: Page title shows "Edit Team Member"
   - ✅ Expected: Loading spinner appears briefly
   - ✅ Expected: Form loads with all data pre-filled

3. **Verify Pre-filled Data**
   - ✅ Role dropdown shows current role
   - ✅ References/Position shows current value
   - ✅ Name field populated
   - ✅ Email field populated
   - ✅ Phone number populated (if exists)
   - ✅ All professional details populated
   - ✅ Profile photo URL populated (if exists)
   - ✅ Article contribution checkbox state correct

4. **Make Changes**
   - Update role (e.g., Member → Vice President)
   - Change references/position title
   - Modify name or email
   - Update profile photo URL (must be Cloudinary)
   - Toggle article contribution checkbox

5. **Submit Changes**
   - Click **Update Team Member** button
   - ✅ Expected: Success message appears
   - ✅ Expected: Redirects to admin panel after ~1.5 seconds
   - ✅ Expected: Changes visible in team members list

6. **Validation Tests**
   - Try submitting with empty name
   - ✅ Expected: "Required fields" error shown
   - Try submitting with empty email
   - ✅ Expected: "Required fields" error shown
   - Try non-Cloudinary profile photo URL
   - ✅ Expected: Validation error shown

### API Endpoint Test
- **Endpoint**: `PUT /api/admin/edit-team-member`
- **Required Fields**: teamMemberId, name, emailId
- **Optional Fields**: barRegistrationNo, title, legalTitle, phoneNo, yearOfBirth, placeOfPractice, address, enrollment, webinarPrimaryPreference, webinarSecondaryPreference, articleContribution, references, profilePhoto, role
- **Validation**: Cloudinary URL for profilePhoto field
- **Default Values**: role defaults to "Member", articleContribution defaults to false

---

## 4️⃣ Test Podcast Editing

### Test Location
- Navigate to: `/admin-panel`
- Scroll to: **Podcasts Section**

### Test Steps
1. **Click Edit Button**
   - Find any podcast in the list
   - Click the **Edit** button
   - ✅ Expected: Redirects to `/admin/upload-podcast?id=[podcastId]`

2. **Verify Page Load**
   - ✅ Expected: Page title shows "Edit Podcast"
   - ✅ Expected: Form component loads
   - ✅ Expected: Loading state appears during data fetch

3. **Verify Pre-filled Data**
   - ✅ Title field populated
   - ✅ Description field populated
   - ✅ Video URL populated
   - ✅ Thumbnail URL populated (if exists)
   - ✅ Category selected correctly
   - ✅ Tags populated (if exist)

4. **Make Changes**
   - Update podcast title
   - Modify description
   - Change video URL (must be Cloudinary)
   - Update thumbnail URL (must be Cloudinary)
   - Change category
   - Add/modify tags

5. **Submit Changes**
   - Click **Update Podcast** button
   - ✅ Expected: Success message appears
   - ✅ Expected: Redirects to admin panel
   - ✅ Expected: Changes visible in podcasts list

6. **Validation Tests**
   - Try submitting with empty title
   - ✅ Expected: Validation error shown
   - Try submitting with empty video URL
   - ✅ Expected: Validation error shown
   - Try non-Cloudinary video URL
   - ✅ Expected: Validation error shown

### API Endpoint Test
- **Endpoint**: `PUT /api/admin/edit-podcast`
- **Required Fields**: podcastId, title, videoUrl
- **Optional Fields**: description, thumbnailUrl, category, tags[]
- **Validation**: Cloudinary URL for videoUrl and thumbnailUrl fields
- **Default Values**: description defaults to '', category defaults to 'General', tags defaults to []

---

## 🔍 Edge Cases to Test

### 1. Navigation Tests
- [ ] Click Edit button → verify URL changes correctly
- [ ] Refresh page while editing → data should reload
- [ ] Click Cancel button → should return to admin panel
- [ ] Click browser back button → should work correctly

### 2. Data Persistence Tests
- [ ] Edit record → submit → refresh page → verify changes persisted
- [ ] Edit record → navigate away → return → verify changes still there
- [ ] Edit multiple times → verify all changes accumulate correctly

### 3. Error Handling Tests
- [ ] Submit without internet connection → verify error message
- [ ] Submit duplicate email (team members) → verify error handling
- [ ] Submit non-existent ID → verify 404 handling
- [ ] Submit with server error → verify graceful error handling

### 4. UI/UX Tests
- [ ] Loading states appear during data fetching
- [ ] Loading states appear during submission
- [ ] Success messages display correctly
- [ ] Error messages display correctly
- [ ] Form fields are disabled during loading
- [ ] Submit button shows loading indicator

### 5. Permission Tests
- [ ] Logout and try accessing edit pages → should redirect to auth
- [ ] Login as non-admin → should show forbidden error
- [ ] Verify only admins can access edit endpoints

---

## 🐛 Known Issues / Limitations

None currently identified. All functionality implemented as per requirements.

---

## 📊 Test Results Template

### News Editing
- [ ] Edit button works
- [ ] Data pre-population works
- [ ] Changes persist
- [ ] Validation works
- [ ] Error handling works

### Judge Editing
- [ ] Edit button works
- [ ] Page redirect works
- [ ] Data pre-population works
- [ ] JSON editing works
- [ ] Changes persist
- [ ] Validation works

### Team Member Editing
- [ ] Edit button works
- [ ] Page redirect works
- [ ] Data pre-population works
- [ ] All fields editable
- [ ] Changes persist
- [ ] Validation works

### Podcast Editing
- [ ] Edit button works
- [ ] Page redirect works
- [ ] Data pre-population works
- [ ] Form editing works
- [ ] Changes persist
- [ ] Validation works

---

## 🎓 Testing Best Practices

1. **Test in Order**: Start with News (simplest) → Judge → Team Member → Podcast
2. **Use Real Data**: Test with actual production-like data
3. **Check Console**: Monitor browser console for errors
4. **Test Validation**: Try invalid inputs to ensure validation works
5. **Verify Persistence**: Always refresh after editing to confirm changes saved
6. **Document Issues**: Note any bugs or unexpected behavior

---

## 🚀 Post-Testing Actions

After successful testing:
1. ✅ Mark todo as complete
2. ✅ Document any discovered issues
3. ✅ Commit final changes
4. ✅ Push to repository
5. ✅ Deploy to production (if applicable)

---

## 📝 Implementation Summary

### Files Modified for Edit Functionality

#### API Endpoints (4 files)
1. `src/pages/api/admin/edit-news.ts` - News editing endpoint
2. `src/pages/api/admin/edit-judge.ts` - Judge editing endpoint
3. `src/pages/api/admin/edit-team-member.ts` - Team member editing endpoint
4. `src/pages/api/admin/edit-podcast.ts` - Podcast editing endpoint

#### Edit Pages (3 files)
1. `src/pages/admin/add-judge.tsx` - Supports edit mode via `?id=` query param
2. `src/pages/admin/add-team-member.tsx` - Supports edit mode via `?id=` query param
3. `src/components/PodcastUploadForm.tsx` - Supports edit mode via `id` prop

#### Admin Panel UI (1 file)
1. `src/pages/admin-panel.tsx` - Edit buttons on lines 786, 942, 1128, 1309

#### News Component (1 file)
1. `src/components/news/NewsVideoUploadForm.tsx` - Inline edit form support

---

**Total Implementation**: 9 files modified/created
**Total Lines of Code**: ~1500+ lines
**Test Coverage Needed**: 4 entities × 6 test scenarios = 24 test cases

---

## ✨ Ready for Testing!

All edit functionality is implemented and ready for comprehensive manual testing. Follow the checklist above to verify each feature works correctly.
