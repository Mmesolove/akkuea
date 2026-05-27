use soroban_sdk::{contracttype, Address, Bytes, Env, Symbol, symbol_short};
use soroban_sdk::xdr::{FromXdr, ToXdr};
use cougr_core::component::{ComponentStorage, ComponentTrait};
use cougr_core::impl_component;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PropertyCoords {
    pub x: u32,
    pub y: u32,
}

impl_component!(PropertyCoords, "coords", Table, { x: u32, y: u32 });

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PropertyOwner {
    pub address: Address,
}

impl ComponentTrait for PropertyOwner {
    fn component_type() -> Symbol {
        symbol_short!("owner")
    }

    fn serialize(&self, env: &Env) -> Bytes {
        self.address.clone().to_xdr(env)
    }

    fn deserialize(env: &Env, data: &Bytes) -> Option<Self> {
        let address = Address::from_xdr(env, data).ok()?;
        Some(PropertyOwner { address })
    }

    fn default_storage() -> ComponentStorage {
        ComponentStorage::Table
    }
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PropertyMeta {
    pub level: u32,
    pub last_claimed_ledger: u64,
    pub approved_spender: u32, // entity id of approved address, 0 if none
}

impl_component!(PropertyMeta, "meta", Sparse, {
    level: u32,
    last_claimed_ledger: u64,
    approved_spender: u32,
});
