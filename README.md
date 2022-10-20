# Boilerplate for NFT Minting Application

This boilerplate is for NFT Minting applications. Using this boiler plate, a minting site can be created in about 30 minutes.

![image](https://user-images.githubusercontent.com/53442928/194472429-931d32dd-d0ab-401a-93d7-8b6d4bdcc34a.png)

# Getting started

I will now show you how to use this boilerplate.

Demo application is [here](https://main.d35ib1ruq9ljhz.amplifyapp.com/)

Need help? Ask in [our discord](https://discord.gg/wCFUV6rNd7).

## 1. Store metadata for NFTs

### Get an overview

First, metadata and images for NFT must be stored in storage.

For example, if you wish to issue 30 NFTs, create directories and files like the following.

- images
  - 0.png
  - 1.png
  - 2.png
  - ...
  - 29.png
- json
  - 0.json
  - 1.json
  - 2.json
  - ...
  - 29.json

The JSON file looks like this. 

Since the image field requires the URI of the image to be entered, the first step is to save the images somewhere and then enter the URI in the JSON.

`0.json`:
```json
{
  "name": "Bunzz #0",
  "description": "Bunzz NFT",
  "image": "<URI for image>",
  "edition": 0,
  "date": 1664941479203,
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Black"
    },
    {
      "trait_type": "Bottom lid",
      "value": "High"
    },
    {
      "trait_type": "Top lid",
      "value": "Middle"
    }
  ],
}
```

### Download hashlips

These JSON and images can be created manually, but there is a useful tool called hashlips that can be used to create generative NFT.

The basic generative NFT is created by creating multiple images, one for each layer of background color, hat, etc., and combining them. hashlips is a tool that makes it easy to do this.

https://github.com/HashLips/hashlips_art_engine

We will use this repository, so download it.
```bash
$ git clone https://github.com/HashLips/hashlips_art_engine
```

Go to the hashlips directory and install the dependencies. 

**Note:** Use node version `14.18.x`.

```bash
$ yarn install
```

### Check directory structure

By default, there are these layers, each containing images in its own directory. The generative NFT overlaps one image from each layer to produce a single image.

<img width="155" alt="スクリーンショット 2022-10-11 11 10 57" src="https://user-images.githubusercontent.com/53442928/194981485-d181519d-c2a1-4da6-8e0a-5596c28af045.png">

For use in a production environment, try replacing these images to create your own generative art.

If you replace it, please also change the following part of `config.json`.

<img width="625" alt="スクリーンショット 2022-10-11 11 16 07" src="https://user-images.githubusercontent.com/53442928/194982080-1f1290a3-f557-4106-b42d-efa1fa172e93.png">

### Determine the number of images

Determines the number of images to be generated. Set the value `growSizeEditionTo` in `config.json` to any value you like. This time, we will set the number to 30.

<img width="625" alt="スクリーンショット 2022-10-11 11 16 07" src="https://user-images.githubusercontent.com/53442928/194982080-1f1290a3-f557-4106-b42d-efa1fa172e93.png">

In addition, change line 343 in `main.js` as follows.

```javascript
- let i = network == NETWORK.sol ? 0 : 1;
+ let i = 0;
```

This is because the NFT contract used in this project has a token ID that starts with 0, so the file name is also set to start with 0.

### Make images and json

Now let's create the image and JSON files. 

```bash
$ node index.js
```

The deliverables are contained in the `build` directory.

<img width="127" alt="スクリーンショット 2022-10-11 11 34 28" src="https://user-images.githubusercontent.com/53442928/194984077-60e5a508-65d8-407c-89d9-f72380f6c23d.png">

### Uploading images data to IPFS

First, upload the image files to IPFS. You can use a service called Pinata.

https://app.pinata.cloud/pinmanager

Select the folder upload.

<img width="307" alt="スクリーンショット 2022-10-11 11 36 58" src="https://user-images.githubusercontent.com/53442928/194984309-074793ac-2b8b-432c-b05d-e9f715c2ab80.png">

Upload the `build/images` you just created.

<img width="531" alt="スクリーンショット 2022-10-11 11 38 16" src="https://user-images.githubusercontent.com/53442928/194984485-9969044a-9767-467e-8032-66d5185718eb.png">

Enter any name you like. When you are done, click Upload.

<img width="533" alt="スクリーンショット 2022-10-11 11 39 38" src="https://user-images.githubusercontent.com/53442928/194984647-90764de5-5def-4425-ac82-9b5c6ed42edf.png">

Once the upload is complete, you will see the following row.

<img width="794" alt="スクリーンショット 2022-10-11 11 45 25" src="https://user-images.githubusercontent.com/53442928/194985347-fc8d0434-d2cc-45b2-b8a2-ad34a42b3217.png">

### Upload JSON files

As introduced in [first section](#get-an-overview), the URI of the image must be entered in the image field of the JSON file.

Paste the CID from earlier after `ipfs://` in the `baseUri` of `config.js`

<img width="585" alt="スクリーンショット 2022-10-11 11 52 41" src="https://user-images.githubusercontent.com/53442928/194986197-2e7ad24d-c421-4dd5-8f92-7d8429bdb081.png">

Then execute the command.

```bash
$ node utils/update_info.js
```

The contents of `build/json` will then be rewritten so that the image field of each JSON file points to the uploaded image.

<img width="585" alt="スクリーンショット 2022-10-11 11 55 46" src="https://user-images.githubusercontent.com/53442928/194986631-9f932024-941d-4fcf-bc1f-d2eb0ca502e2.png">

Now upload the `build/json` directory to IPFS in the same way as for `build/images`.


## 2. Deploy smart contract

Having uploaded the JSON and image files to storage, the next step is to prepare the smart contract.

### Create DApp

Please access to [Bunzz](https://app.bunzz.dev/).

Once accessed, connect to the wallet.

<img width="417" alt="スクリーンショット 2022-10-11 16 17 49" src="https://user-images.githubusercontent.com/53442928/195021321-b4620fc5-daf0-4456-9572-0ed71fdc602f.png">

Once connected, make sure you have enough MATIC. If you do not have enough MATIC, you can get it [here](https://faucet.polygon.technology/).

Then click on "Create Dapp".

<img width="1440" alt="スクリーンショット 2022-10-11 12 00 44" src="https://user-images.githubusercontent.com/53442928/194987243-adda1ab1-77ec-405b-a1fb-9f5f3ffcbeee.png">

Next, enter a name.

<img width="1440" alt="スクリーンショット 2022-10-11 12 03 23" src="https://user-images.githubusercontent.com/53442928/194987540-81d0a222-8008-41e1-a7dc-5c9c2162a537.png">

Next, select the chain. Here we will use Mumbai Testnet.

<img width="1440" alt="スクリーンショット 2022-10-11 12 04 16" src="https://user-images.githubusercontent.com/53442928/194987645-980781d5-c31e-4935-aee2-6c02171219b3.png">

Then go to the All tab and type "leadedge".

<img width="1440" alt="スクリーンショット 2022-10-11 12 05 57" src="https://user-images.githubusercontent.com/53442928/194987872-3eaa3671-33cc-42fb-85c3-e1532b12ecea.png">

Then click on "Add+". And click "Continue".

<img width="1440" alt="スクリーンショット 2022-10-11 12 08 00" src="https://user-images.githubusercontent.com/53442928/194988126-aa90efa1-d2a5-4399-a61b-b84f4ccd5b15.png">

Finally, enter the arguments for the contract.

<img width="1440" alt="スクリーンショット 2022-10-11 14 04 09" src="https://user-images.githubusercontent.com/53442928/195001386-20cf14a2-094e-4aa5-b7f9-ef47b2cf5c6f.png">


| argument name             | description                                                                       |                                                       |
|---------------------------|-----------------------------------------------------------------------------------|-------------------------------------------------------|
| name_                     | Contract Name(displayed as Collection Name at Marketplaces)                       | test                                                  |
| symbol_                   | Symbol of a token (NFT), like USD or YEN. For example, BAYC, AZUKI, etc.          | TEST                                                  |
| baseTokenURI_             | IPFS can also be used for the baseTokenURI. For example, Pinata is easy to use    | ipfs://QmZtTG47eDgLLdMzuuQSCwJ4YKEuNRNv6hZ5tD82ah6Fyb/ |
| maxSupply_                | Maximum number of NFTs that can be minted. Set the quantity that can be sold out. | 30                                                    |
| preCost_                  | Mint cost when presale (= only WL users can mint)                                 | 30000000000000000                                     |
| publicCost_               | Mint cost when public sale                                                        | 30000000000000000                                     |
| maxMintableQuantityPerWL_ | Mintable quantity per WL slot(=WL user)                                           | 3                                                     |
| mintableLimitPerTX_       | Upper limit of mintable in one tx. bot prevention                                 | 3                                                     |

When you are finished, click Deploy.

Dapp will then be created and a modal for deploying the module will appear.

Click "Confirm" to deploy.

<img width="1440" alt="スクリーンショット 2022-10-11 14 15 17" src="https://user-images.githubusercontent.com/53442928/195002696-297412a1-c9f6-4da1-8de7-f6ceaf5ad16e.png">

Deployment is complete.

<img width="1440" alt="スクリーンショット 2022-10-11 14 18 55" src="https://user-images.githubusercontent.com/53442928/195003140-b745159b-ac3d-44d5-b9ce-fef85749e24e.png">


This contract also includes an NFT sales feature for whitelisting, but we will not be using that feature in this case, so we will turn that feature off.

[The documentation](https://app.bunzz.dev/module-templates/1309c62a-422e-4cb4-8dfa-333984b6e710) details how to turn off that feature.

> 4. After a presale, start a public sale duration by calling the setPresale and the pause

Now close the modal and click on the down arrow button to the right of the module name.

<img width="1440" alt="スクリーンショット 2022-10-11 14 33 43" src="https://user-images.githubusercontent.com/53442928/195004903-b6d1dbe5-5a03-45f7-bc52-7cccd5c72500.png">

Then the list of functions of the contract will be displayed, and you can actually interact with the contract.

<img width="1440" alt="スクリーンショット 2022-10-11 14 35 12" src="https://user-images.githubusercontent.com/53442928/195005061-fd9e5bc7-d98d-4085-b961-592af82d79ed.png">

Call the `setPresale` and `pause` functions to stop the white list sales function.

<img width="895" alt="スクリーンショット 2022-10-11 14 38 57" src="https://user-images.githubusercontent.com/53442928/195005573-fa38555e-0c06-4468-abc3-566de7f72fbc.png">
<img width="908" alt="スクリーンショット 2022-10-11 14 39 25" src="https://user-images.githubusercontent.com/53442928/195005644-098e625a-348a-4ae1-95d3-bbd1c4e482bf.png">

## 3. Prepare App

The final step is to build a front-end application that communicates with the smart contract.

### Download boilerplate

Please download the [this boilerplate](https://github.com/lastrust/boilerplate-for-nft) first.

```bash
$ git clone https://github.com/lastrust/boilerplate-for-nft.git
$ yarn install
```

### Setup variables

Please create `.env` file in root directory of the project (boilerplate-for-nft/.env).

The method of obtaining each value will now be explained.

```
REACT_APP_DAPP_ID=<your dapp id>
REACT_APP_API_KEY=<your api key>
```

DApp ID and API Key can be viewed by clicking Client SDK from the sidebar of the app.

<img width="238" alt="スクリーンショット 2022-10-11 14 46 08" src="https://user-images.githubusercontent.com/53442928/195006480-96fa2eda-f4ec-40e1-a631-a9d4ff19cd78.png">

If you are using something other than Mumbai Testnet, change the following constants as needed.

<img width="561" alt="スクリーンショット 2022-10-11 15 46 09" src="https://user-images.githubusercontent.com/53442928/195015633-da340e95-7049-41f2-bc47-4eb9011ab8dc.png">

### Start application

When you are ready, launch your application.

```bash
$ yarn start
```

### Test

When you start up the application, you will see a screen like this. 

Please click "Connect" button. And test mint.

<img width="1440" alt="スクリーンショット 2022-10-11 15 49 42" src="https://user-images.githubusercontent.com/53442928/195016228-b84a7ae3-5ebc-4e69-a351-2eac4767ad88.png">

If successful, the minted NFT is displayed as follows.

<img width="1440" alt="スクリーンショット 2022-10-11 16 14 00" src="https://user-images.githubusercontent.com/53442928/195020612-0e22030e-dd84-4ea7-ba93-047e0b3cc0f6.png">

This is an introduction to the use of this module🎉 Thank you.