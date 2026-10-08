import React from 'react';
export default function DemoNotice({onReset,onExport}:{onReset?:()=>void;onExport?:()=>void}){return <aside className="pages-demo-bar" aria-label="وضعیت نسخه تست"><span>نسخه تست Pages؛ تغییرات فقط در همین مرورگر ذخیره می‌شوند.</span><div><button onClick={onExport}>خروجی داده‌ها</button><button onClick={onReset}>بازنشانی تست</button></div></aside>}
