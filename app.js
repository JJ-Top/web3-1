//instanciar la libreria web3
const Web3 = require('web3');

//instanciar la libreria para firmar transacciones
const EthereumTx = require('ethereumjs-tx').Transaction

//instanciar el objeto de web3
  //const web3 = new Web3('https://mainnet.infura.io/v3/5383eef769bc45ccaed69d43a03d6c17');
    //const web3 = new Web3('https://ropsten.infura.io/v3/d4324bfled874e0e9f9a435121a833e2')
    const web3 = new Web3('https://ropsten.infura.io/v3/c5f94f23797c47ecb5fb633740ae8e2f')
//declarar las address publicas con las cuentas que vamos a interactuar
const address1 = '0x4AF92bF32A3824641c813013e108e5C1aAD90C3E';//lassa
//const address1 = "";//
const address2 = '0xEd9333ad25b09748144dAAd34455252411b33512';//lassa
//const address2 = "";//

//declarar las claves privadas en un objeto tipo buffer para poder firmar las transacciones
const addresskey1 = new Buffer.from('201059fbefe95a7e28ceb4955dd3afbe2bf0455bc7473c73649d90ceaf336a22', 'hex');
const addresskey2 = new Buffer.from('4b7630d9c4e23d24f259c02feb2d3224c7834287e2d8ceb819dc74629b274abf', 'hex');

//consulta el saldo de la cuenta 1
console.log('Saldo de la Cuenta 1:');

web3.eth.getBalance(address1, (err, balance) => {
  console.log(  web3.utils.fromWei(balance, 'ether')  )
})


//consulta el saldo de la cuenta 2
console.log('Saldo de la Cuenta 2:');

web3.eth.getBalance(address2, (err, balance) => {  +
    console.log(web3.utils.fromWei(balance, 'ether'))
})

//seccion para realizar una transaccion desde una address a otra

//--para evitar el doble gasto en eth todas las transacc firmadas tienen un nro. que se va incrementando cada vez q se usa una transacc  desde una misma address--

//lo primero es envolver y firmar la transacc, para ello es el ethreumjs-tx

//procedemos a gestionar el nro de transacc
//get transaccioncount retorna el nro. de transaccion para una addrress determinada
web3.eth.getTransactionCount( address1, (err, txCount)   => {
  let rawTx ={
    nonce: web3.utils.toHex(txCount), //nro de cuenta de transacc
    gasPrice: web3.utils.toHex(web3.utils.toWei('2','gwei')), //dime que cantidad son 2 gweis y eso lo convierte a hexadecimal
    gasLimit: web3.utils.toHex(21000),
    //gasPrice: '0x09184e72a000', 
    //gasLimit: '0x2710',
    to: address2,
    value: web3.utils.toHex(1000000000000000000)
    //value: '0x00'
    //data: ''
  }
  
  //instanciar el objeto -tx pasandole como parametro el objeto javascript que hemos hecho de transacc
  //let tx = new EthereumTx(rawTx)
  var tx = new EthereumTx(rawTx, {'chain':'ropsten'});
  //y luego firmarlo con la clave privada del emisor
  tx.sign (addresskey1)

  //esta transacc para que web3 la pueda enviar al nodo la tenemos que convertir en un formato que se acepte en internet, porque hasta ahora es un objeto de javascript
  //hay que serializar el objeto, que es pasarlo a un string que se pueda enviar a internet  
  //web3 va a requerir que sea en un string de tipo hex
  serializedTx = tx.serialize().toString('hex')


  //ahora vamos a llamar al metodo de web3 para que envie la transacc
  web3.eth.sendSignedTransaction ('0x' + serializedTx  ).on ('receipt', console.log)
  

}            )                         

