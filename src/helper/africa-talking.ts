import africastalking from "africastalking";

const credentials = {
  apiKey: "*384*97141#",
  username: "PSI",
};

const africastalkingClient = africastalking(credentials);


class AfricasTalking {
    appId: string = '90101';

     sendSMS = async (to: string, from: string, message: string) => {
        const sms = africastalkingClient.SMS;
        await sms.send({
          to,
          from,
          message,
        });
      };

    creditAirtime = async (to: string, from: string, message: string) => {
        // const sms = africastalkingClient.SMS({}) ;
        // await sms.send({
        //   to,
        //   from,
        //   message,
        // });
      };

}