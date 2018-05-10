import { ClientFunction, Selector } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors';

fixture `Broker Portal`
  .page `http://aboveboard-broker-portal-test:3100/buyers`

const testBuyer = {
  firstName: 'Firstnametest',
  lastName: 'Lastnametest',
  email: 'testemail@aboveboard.ai',
  phone: '555-555-5555',
  addressLine1: 'Suite 123',
  addressLine2: '123 Test Street',
  city: 'Boston',
  state: 'Massachusetts',
  country: 'United States of America',
  zip: '02101',
  ethAddress: '0x57adc0977fdf3d626e70ec4550294e71ef21ce39'
}

const getLocation = ClientFunction(() => document.location.pathname)

const createBuyer = async t =>
  await t
    .click(ReactSelector('MenuItem').withProps('name', 'buyers'))
    .click(ReactSelector('Link').withProps('to', '/buyers/add'))
    .typeText(ReactSelector('Text').withProps('name', 'firstName'), testBuyer.firstName)
    .typeText(ReactSelector('Text').withProps('name', 'lastName'), testBuyer.lastName)
    .typeText(ReactSelector('Text').withProps('name', 'email'), testBuyer.email)
    .typeText(ReactSelector('Text').withProps('name', 'phone'), testBuyer.phone)
    .typeText(ReactSelector('Text').withProps('name', 'addressLine1'), testBuyer.addressLine1)
    .typeText(ReactSelector('Text').withProps('name', 'addressLine2'), testBuyer.addressLine2)
    .typeText(ReactSelector('Text').withProps('name', 'city'), testBuyer.city)
    .typeText(ReactSelector('Text').withProps('name', 'state'), testBuyer.state)
    .typeText(ReactSelector('Dropdown').withProps('name', 'country'), testBuyer.country)
    .typeText(ReactSelector('Text').withProps('name', 'zip'), testBuyer.zip)
    .typeText(Selector('input').withAttribute('name', 'ethAddresses[0].address'), testBuyer.ethAddress)
    .click(Selector('div').withAttribute('name', 'whitelists'))
    .click(Selector('div').withAttribute('name', 'whitelists').find('div.item').nth(1))
    .click(ReactSelector('Button').withProps('type', 'submit'))

test('Token Transfer', async t => {
  await createBuyer(t)

  await t
    .expect(getLocation()).eql('/buyers')
})
