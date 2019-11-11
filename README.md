# use-autorun

React hook for [Meteor](meteor.com)'s `Tracker.autorun`. Use this hook to provide Tracker reactivity to your functional components:


```js
function ExampleComponent(props) {
  // document will update whenever it changes in Minimongo
  const document = useAutorun(() =>  {
    Meteor.subscribe('mySubscription');
    return MyCollection.findOne(myDocumentID);
  });
  
  // Before the subscription is ready, document will be null
  if (!document) {
    return null;
  }
  
  return (
    <div>
      {document._id}
    </div>
  );
};
```
