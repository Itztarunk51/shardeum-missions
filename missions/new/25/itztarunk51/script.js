let web3;
const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "expression",
				"type": "string"
			}
		],
		"name": "evaluate",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
];
    const contractAddress = "0xcc2bdfaa45fd5fe6021117f198491134c3f75ae9";
    var computedValue = null;
    var connectedAddress = null;
    var walletConnected = false;
    var requiredNetworkId = "8082"; // The network ID of the shardeum sphinx


   

    async function connectWallet() {
        if (window.ethereum) {
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const networkId = await window.ethereum.request({ method: 'eth_chainId' });
  
            if (networkId == requiredNetworkId) {
              walletAddressContainer.textContent = '';
              resultContainer.textContent = '';
              errorContainer.textContent = 'Please connect to the shardeum sphinx';
              return;
            }
  
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              connectedAddress = accounts[0];
              walletConnected = true;
              walletAddressContainer.innerHTML = 'Connected Address: ' + connectedAddress;
              evaluateButton.disabled = false;
            }
          } catch (error) {
            walletAddressContainer.textContent = 'Failed to connect wallet: ' + error.message;
          }
        } else {
          walletAddressContainer.textContent = 'Please install MetaMask to connect your wallet.';
        }
      }

    // Handle the "Evaluate" button click event
    evaluateBtn.addEventListener("click", async () => {
      try {
        const expression = expressionInput.value;

        // Create a contract instance
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        // Call the evaluate function on the smart contract
        const result = await contract.methods.evaluate(expression).call();

        // Display the result
        result.textContent = "Result: " + result;
      } catch (error) {
        console.error(error);
      }
    });

    // Initialize Web3 and connect to the test network
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        try {
          // Request access to the user's accounts
          await ethereum.enable();
          web3 = new Web3(ethereum);

          // Update the UI with the connected wallet address if already connected
          if (ethereum.selectedAddress) {
            updateWalletAddress(ethereum.selectedAddress);
          }
        } catch (error) {
          console.error(error);
        }
      } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
      } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }
    });