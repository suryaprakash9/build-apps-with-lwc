import { publish, MessageContext } from 'lightning/messageService';
import BEAR_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/BearListUpdate__c';
import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, wire } from 'lwc';
import ursusResources from '@salesforce/resourceUrl/ursus_park'; // Static resource
/** BearController.getAllBears() Apex method */
//import getAllBears from '@salesforce/apex/BearController.getAllBears';
import searchBears from '@salesforce/apex/BearController.searchBears';

export default class BearList extends NavigationMixin(LightningElement) {
    searchTerm = '';
    
	//@wire(searchBears, {searchTerm: '$searchTerm'})
	//bears;
	
	bears;
	@wire(MessageContext) messageContext;
	@wire(searchBears, {searchTerm: '$searchTerm'})
	loadBears(result) {
	this.bears = result;
	if (result.data) {
		const message = {
		bears: result.data
		};
		publish(this.messageContext, BEAR_LIST_UPDATE_MESSAGE, message);
	}
	}
	//error;
    // Expose URL of assets included inside an archive file
	appResources = {
		bearSilhouette: `${ursusResources}/img/standing-bear-silhouette.png`,
	};

    handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}
	get hasResults() {
		return (this.bears.data.length > 0);
	}
	handleBearView(event) {
		// Get bear record id from bearview event
		const bearId = event.detail;
		// Navigate to bear record page
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: bearId,
				objectApiName: 'Bear__c',
				actionName: 'view',
			},
		});
	}


    /*
	connectedCallback() {
		this.loadBears();
	}
    //Retrieving data using this approach is called imperative Apex.
	loadBears() {
		getAllBears()
			.then(result => {
				this.bears = result;
			})
			.catch(error => {
				this.error = error;
			});
	}  */


    /*

    1.Edit bearList.html and replace <template if:true={bears}> with <template if:true={bears.data}>.
    2.Replace <template for:each={bears} for:item="bear"> with <template for:each={bears.data} for:item="bear">.
    3.Replace <template if:true={error}> with <template if:true={bears.error}>. At this point the template is mostly the same other than the imperative Apex. We are now accessing the list of bears by calling bears.data instead of just bears, and we are now retrieving errors with bears.error instead of just error.
    4.Replace the contents of bearList.js with:

    import { LightningElement, wire } from 'lwc';
    import ursusResources from '@salesforce/resourceUrl/ursus_park';
    // BearController.getAllBears() Apex method //
    import getAllBears from '@salesforce/apex/BearController.getAllBears';
    export default class BearList extends LightningElement {
        @wire(getAllBears) bears;
        appResources = {
            bearSilhouette: `${ursusResources}/img/standing-bear-silhouette.png`,
        };
    }

    5.We’ve greatly simplified the JS code by decorating our bears property with wired Apex. All the data we need is now coming through this single line: @wire(getAllBears) bears;

    */
}