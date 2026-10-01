# برندبوک سوسیسا (زنده)

سایت استاتیک RTL برای GitHub Pages. بدون build؛ فقط فایل‌ها را ویرایش و push کنید.

## به‌روزرسانی
- محتوای هر فصل: `data/chNN.js` (هر بخش: `id, t, st, owner, body`)
- وضعیت بخش `st`: final | early | draft | open | later
- نسخه/تاریخ/لاگ تغییرات: `data/meta.js`

## انتشار
1. ریپوی جدید بساز (مثلاً `susisa-brandbook`) و همه‌ی فایل‌ها را در ریشه push کن
2. Settings → Pages → Branch: main / root
3. آدرس: https://<account>.github.io/<repo>/

## تست محلی
`python3 -m http.server` در همین پوشه

## فصل ۱ (Raw Brand Notes)
نسخهٔ کامل شامل گفته‌های خصوصی مصاحبه است و تا تصمیم دربارهٔ خصوصی‌بودن ریپو در این ریپو فقط یک stub دارد (`data/ch01.js`). نسخهٔ کامل در ولت تیم است.
