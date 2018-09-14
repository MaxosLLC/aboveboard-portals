import token072618 from 'lib/contracts/07-26-18/RegulatedToken'
import regulatorService072618 from 'lib/contracts/07-26-18/RegulatorService'
import settingsStorage072618 from 'lib/contracts/07-26-18/SettingsStorage'
import multisig072618 from 'lib/contracts/07-26-18/MultiSigArbitration'
import whitelist072618 from 'lib/contracts/07-26-18/SecureIssuanceWhiteList'

const abis = {
  '07-26-18': {
    token: token072618.abi,
    regulatorService: regulatorService072618.abi,
    settingsStorage: settingsStorage072618.abi,
    multisig: multisig072618.abi,
    whitelist: whitelist072618.abi
  }
}

const bins = {
  '07-26-18': {
    token: token072618.bytecode,
    regulatorService: regulatorService072618.bytecode,
    settingsStorage: settingsStorage072618.bytecode,
    multisig: multisig072618.bytecode,
    whitelist: whitelist072618.bytecode
  }
}

export const getAbi = (contractType, version = '07-26-18') => {
  return abis[version][contractType]
}

export const getBin = (contractType, version = '07-26-18') => {
  return bins[version][contractType]
}
