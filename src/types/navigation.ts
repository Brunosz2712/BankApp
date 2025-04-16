export type RootStackParamList = {
    Dashboard: undefined;
    TransactionDetails: { transactionId: string }; 
    SendMoney: undefined;
    ReceiveMoney: undefined;
    
   };
   
   declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
   }