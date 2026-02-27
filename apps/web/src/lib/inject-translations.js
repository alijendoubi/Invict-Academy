const fs = require('fs');
const path = require('path');

const tsFiles = ['en.ts', 'fr.ts', 'ar.ts', 'tr.ts', 'az.ts'];
const translations = {
    'en': '        features: [\n            { title: "Money-Back Guarantee", desc: "We stand by our expertise. Refunds apply in case of any issues related to our admission service. Your success is our priority!" },\n            { title: "72-Hour Application Start", desc: "We begin your university application within 72 hours of signing. No weeks of waiting." },\n            { title: "Dedicated Personal Advisor", desc: "One advisor owns your file from Day 1 to Arrival Day. You\'ll always know who to call." },\n            { title: "Free DSU Scholarship Filing", desc: "We file your DSU scholarship application at no extra charge — up to €7,500/year secured." },\n            { title: "12 Countries, 200+ Programs", desc: "Access to programs across Italy, Germany, France, Spain and beyond — all in one place." },\n            { title: "WhatsApp Updates 24/7", desc: "Real-time updates on your application status via WhatsApp. We never leave you guessing." }\n        ],',
    'fr': '        features: [\n            { title: "Garantie de Remboursement", desc: "Nous garantissons notre expertise. Les remboursements s\'appliquent en cas de problème lié à notre service d\'admission. Votre succès est notre priorité !" },\n            { title: "Début de Candidature en 72H", desc: "Nous commençons votre candidature universitaire dans les 72 heures suivant la signature. Plus de semaines d\'attente." },\n            { title: "Conseiller Personnel Dédié", desc: "Un conseiller s\'occupe de votre dossier du jour 1 à votre arrivée. Vous saurez toujours qui appeler." },\n            { title: "Dossier de Bourse DSU Gratuit", desc: "Nous déposons votre demande de bourse DSU sans frais supplémentaires — jusqu\'à 7 500 €/an sécurisés." },\n            { title: "12 Pays, Plus de 200 Programmes", desc: "Accès à des programmes en Italie, Allemagne, France, Espagne et plus encore — tout au même endroit." },\n            { title: "Mises à jour WhatsApp 24/7", desc: "Mises à jour en temps réel sur le statut de votre candidature via WhatsApp. Nous ne vous laissons jamais dans le doute." }\n        ],',
    'ar': '        features: [\n            { title: "ضمان استرداد الأموال", desc: "نحن نثق بخبرتنا. تُطبق المبالغ المستردة في حالة وجود أي مشكلات تتعلق بخدمة القبول لدينا. نجاحك هو أولويتنا!" },\n            { title: "بدء التقديم خلال 72 ساعة", desc: "نبدأ التقديم للجامعة في غضون 72 ساعة من التوقيع. لا مزيد من أسابيع الانتظار." },\n            { title: "مستشار شخصي مخصص", desc: "يتولى مستشار واحد ملفك من اليوم الأول إلى يوم الوصول. ستعرف دائمًا بمن تتصل." },\n            { title: "تقديم طلب منحة DSU مجانًا", desc: "نقدم طلب منحة DSU الخاصة بك دون أي رسوم إضافية — تأمين ما يصل إلى 7500 يورو سنويًا." },\n            { title: "12 دولة، أكثر من 200 برنامج", desc: "الوصول إلى البرامج في جميع أنحاء إيطاليا وألمانيا وفرنسا وإسبانيا وغيرها — كل ذلك في مكان واحد." },\n            { title: "تحديثات واتساب على مدار الساعة", desc: "تحديثات في الوقت الفعلي حول حالة طلبك عبر واتساب. لن نتركك أبدًا في حيرة." }\n        ],',
    'tr': '        features: [\n            { title: "Para İade Garantisi", desc: "Uzmanlığımızın arkasındayız. Kabul hizmetimizle ilgili herhangi bir sorun olması durumunda iadeler geçerlidir. Başarınız bizim önceliğimizdir!" },\n            { title: "72 Saatte Başvuru Başlangıcı", desc: "Sözleşmeyi imzaladıktan sonra 72 saat içinde üniversite başvurunuza başlıyoruz. Artık haftalarca beklemek yok." },\n            { title: "Özel Kişisel Danışman", desc: "İlk günden varış gününe kadar tek bir danışman dosyanızla ilgilenir. Kimi arayacağınızı her zaman bileceksiniz." },\n            { title: "Ücretsiz DSU Burs Başvurusu", desc: "DSU burs başvurunuzu hiçbir ek ücret ödemeden yapıyoruz — yılda 7.500 €\'ya kadar güvence altında." },\n            { title: "12 Ülke, 200+ Program", desc: "İtalya, Almanya, Fransa, İspanya ve ötesindeki programlara erişim — hepsi tek bir yerde." },\n            { title: "7/24 WhatsApp Güncellemeleri", desc: "WhatsApp üzerinden başvuru durumunuz hakkında gerçek zamanlı güncellemeler. Sizi asla tahmin yürütmek zorunda bırakmıyoruz." }\n        ],',
    'az': '        features: [\n            { title: "Pulun Qaytarılması Zəmanəti", desc: "Təcrübəmizə güvənirik. Qəbul xidmətimizlə bağlı hər hansı problem yarandıqda pulunuz geri qaytarılır. Sizin uğurunuz bizim prioritetimizdir!" },\n            { title: "72 Saat İçində Müraciətə Başlama", desc: "Müqavilə imzalandıqdan sonra 72 saat ərzində universitet müraciətinizə başlayırıq. Artıq həftələrlə gözləməyə ehtiyac yoxdur." },\n            { title: "Xüsusi Şəxsi Məsləhətçi", desc: "İlk gündən gəliş gününə qədər bir məsləhətçi dosyenizlə maraqlanır. Kimi axtaracağınızı həmişə biləcəksiniz." },\n            { title: "Pulsuz DSU Təqaüd Müraciəti", desc: "Heç bir əlavə xərc olmadan DSU təqaüd müraciətinizi edirik — ildə 7.500 avroya qədər təminatla." },\n            { title: "12 Ölkə, 200+ Proqram", desc: "İtaliya, Almaniya, Fransa, İspaniya və digər ölkələrdəki proqramlara çıxış — hamısı bir yerdə." },\n            { title: "7/24 WhatsApp Yenilənmələri", desc: "WhatsApp vasitəsilə müraciətinizin statusu haqqında real vaxt rejimində yenilənmələr. Sizi heç vaxt şübhə içində qoymuruq." }\n        ],'
}

tsFiles.forEach(file => {
    const fullPath = path.resolve('d:/Invict Academy/Invict-Academy/apps/web/src/lib/translations/' + file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');

        // This regex specifically isolates the entire block between `homepage: {` and `whyUsBadge:`
        // and aggressively deletes it.
        const cleanRegex = /homepage:\s*\{[\s\S]*?whyUsBadge:/g;
        content = content.replace(cleanRegex, 'homepage: {\nwhyUsBadge:');

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Cleaned ' + file);

        let newContent = fs.readFileSync(fullPath, 'utf8');
        const lang = file.split('.')[0];
        const insertRegex = /homepage:\s*\{/;
        if (newContent.match(insertRegex)) {
            newContent = newContent.replace(insertRegex, 'homepage: {\n' + translations[lang]);
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log('Updated ' + file);
        }
    } else {
        console.log('File ' + file + ' not found');
    }
});
