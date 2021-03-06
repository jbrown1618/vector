<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@josh-brown/vector](./vector.md) &gt; [SupportVectorMachineClassifier](./vector.supportvectormachineclassifier.md)

## SupportVectorMachineClassifier class

A [Classifier](./vector.classifier.md) model which uses logistic regression to predict a discrete target. The optimal set of parameters is computed with gradient descent.

<b>Signature:</b>

```typescript
export declare class SupportVectorMachineClassifier implements Classifier<SupportVectorMachineHyperparams> 
```
<b>Implements:</b> [Classifier](./vector.classifier.md)<!-- -->&lt;[SupportVectorMachineHyperparams](./vector.supportvectormachinehyperparams.md)<!-- -->&gt;

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(hyperParameters)](./vector.supportvectormachineclassifier._constructor_.md) |  | Constructs a new instance of the <code>SupportVectorMachineClassifier</code> class |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [getHyperParameters()](./vector.supportvectormachineclassifier.gethyperparameters.md) |  | Return the full set of hyperparameters used to train the model, including defaults. |
|  [getParameters()](./vector.supportvectormachineclassifier.getparameters.md) |  | Get the weights of the trained SVM, or <code>undefined</code> if the model has not been trained. |
|  [predict(data)](./vector.supportvectormachineclassifier.predict.md) |  | Uses the learned parameters to make predictions based on a set of input data. |
|  [predictProbabilities(\_data)](./vector.supportvectormachineclassifier.predictprobabilities.md) |  | Uses the learned parameters to make predictions for the probability of an event based on a set of input data. |
|  [train(data, target)](./vector.supportvectormachineclassifier.train.md) |  | Learns the optimal set of parameters for the model. |

