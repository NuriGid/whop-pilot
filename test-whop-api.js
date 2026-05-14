const { Whop } = require('@whop/sdk');
const whop = new Whop({ apiKey: process.env.WHOP_API_KEY });
async function test() {
  try {
    const company = await whop.companies.retrieve('biz_hRcZv2fxhfD0um');
    console.log('Company:', company.title);
    
    const payments = await whop.payments.list({ company_id: 'biz_hRcZv2fxhfD0um' });
    console.log('Payments count:', payments.data?.length);
  } catch (e) {
    console.error(e);
  }
}
test();
