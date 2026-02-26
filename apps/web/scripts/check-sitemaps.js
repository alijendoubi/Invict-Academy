const http = require('http');
const https = require('https');

async function fetchUrl(url) {
    const moduleToUse = url.startsWith('https') ? https : http;

    return new Promise((resolve, reject) => {
        moduleToUse.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data
                });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function validateSitemap(url) {
    console.log(`\n🔍 Validating ${url}...`);
    try {
        const response = await fetchUrl(url);

        let isValid = true;

        if (response.status !== 200) {
            console.error(`❌ FAILED: Status is ${response.status}, expected 200`);
            isValid = false;
        } else {
            console.log(`✅ Status is 200 OK`);
        }

        const contentType = response.headers['content-type']?.toLowerCase() || '';
        if (!contentType.includes('xml')) {
            console.error(`❌ FAILED: Content-Type is '${contentType}', expected to include 'xml'`);
            isValid = false;
        } else {
            console.log(`✅ Content-Type is correct: ${contentType}`);
        }

        if (response.data.includes('${')) {
            console.error(`❌ FAILED: Found unrendered template variable '\${' in XML output!`);
            isValid = false;
        } else {
            console.log(`✅ No unrendered template variables found.`);
        }

        const isIndex = url.endsWith('sitemap.xml');
        if (isIndex && !response.data.includes('<sitemapindex')) {
            console.error(`❌ FAILED: Missing <sitemapindex> tag in root sitemap`);
            isValid = false;
        } else if (!isIndex && !response.data.includes('<urlset')) {
            console.error(`❌ FAILED: Missing <urlset> tag in sub-sitemap`);
            isValid = false;
        } else {
            console.log(`✅ Root tag is correct`);
        }

        // Validate absoluteness of loc URLs
        const locRegex = /<loc>(.*?)<\/loc>/g;
        let match;
        let urlCount = 0;
        let invalidUrls = 0;

        while ((match = locRegex.exec(response.data)) !== null) {
            urlCount++;
            const locUrl = match[1];
            if (!locUrl.startsWith('https://invict.academy/')) {
                // Also check if they are absolute for localhost testing, but the requirement is absolute to https://invict.academy
                if (url.includes('localhost') && locUrl.startsWith('http')) {
                    // Valid enough for local testing if we test against localhost, but the site says baseUrl='https://invict.academy'
                    if (locUrl.startsWith('https://invict.academy')) {
                        // Good
                    } else if (!locUrl.startsWith('http://localhost')) {
                        console.error(`❌ FAILED: URL ${locUrl} is not absolute to invict.academy`);
                        invalidUrls++;
                    }
                } else if (!locUrl.startsWith('https://invict.academy/')) {
                    if (locUrl !== 'https://invict.academy') {
                        console.error(`❌ FAILED: URL ${locUrl} does not start with https://invict.academy/`);
                        invalidUrls++;
                    }
                }
            }
        }

        if (invalidUrls > 0) {
            isValid = false;
        } else {
            console.log(`✅ All ${urlCount} <loc> URLs are valid absolutes`);
        }

        if (isValid) {
            console.log(`✅ PASS: ${url} is valid!`);
            return true;
        } else {
            console.error(`❌ FAIL: ${url} has errors!`);
            return false;
        }

    } catch (error) {
        console.error(`❌ Error fetching ${url}: ${error.message}`);
        return false;
    }
}

async function runTests() {
    const baseUrl = process.argv[2] || 'http://localhost:3000';
    console.log(`Starting Sitemap Validation against ${baseUrl}`);

    const sitemaps = [
        `${baseUrl}/sitemap.xml`,
        `${baseUrl}/sitemap-static.xml`,
        `${baseUrl}/sitemap-countries.xml`,
        `${baseUrl}/sitemap-universities.xml`,
        `${baseUrl}/sitemap-blog.xml`
    ];

    let allPass = true;
    for (const url of sitemaps) {
        const passed = await validateSitemap(url);
        if (!passed) allPass = false;
    }

    console.log(`\n========================================`);
    if (allPass) {
        console.log(`🎉 ALL SITEMAP TESTS PASSED SUCCESSFULLY!`);
        process.exit(0);
    } else {
        console.log(`🚨 SOME SITEMAP TESTS FAILED! Review the logs above.`);
        process.exit(1);
    }
}

runTests();
