import { ClientFunction, Selector } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors';
import { transfer } from './helpers/ethereum'

fixture `Broker Portal`
  .page `http://aboveboard-broker-portal-test:3100/settings`

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
    .click(Selector('div').withAttribute('name', 'whitelists').find('div.item').nth(0))
    .click(ReactSelector('Button').withProps('type', 'submit'))

const followToken = async t =>
  await t
    .click(Selector('div').withAttribute('name', 'watchingTokens'))
    .click(Selector('div').withAttribute('name', 'watchingTokens').find('div.item').nth(0))

const verifyShareholderData = async t =>
  await t
    .expect(Selector('tr').withAttribute('name', 'shareholders').find('td').nth(1).innerText).eql(`${testBuyer.firstName} ${testBuyer.lastName}`)

test('Token Transfer', async t => {
  await t.wait(3000)

  await followToken(t)

  await createBuyer(t)

  await t.expect(getLocation()).eql('/buyers')

  await transfer(testBuyer.ethAddress, 100)

  await t.navigateTo('http://aboveboard-issuer-registry-test:3100/settings')

  await t.click(ReactSelector('MenuItem').withProps('name', 'tokens'))

  await t.click(ReactSelector('TableRow').withProps('name', 'tokens'))

  await verifyShareholderData(t)
})
