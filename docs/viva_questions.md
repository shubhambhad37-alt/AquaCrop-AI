# Viva Questions and Simple Answers

1. **What is water footprint?**  
   It is the total freshwater used or polluted to produce a product, usually expressed per unit such as L/kg.

2. **What is blue water?**  
   Irrigation or other surface and groundwater consumed in production.

3. **What is green water?**  
   Rainwater stored in soil and used by crops.

4. **What is grey water?**  
   The freshwater volume theoretically required to dilute pollutants to an acceptable standard.

5. **Why is this a regression problem?**  
   The target, L/kg, is a continuous numerical value.

6. **What is the input to the model?**  
   Crop, region, weather, farm scale, production, irrigation, soil, and duration fields.

7. **What is the target?**  
   Estimated water footprint in litres per kilogram.

8. **Why use Linear Regression?**  
   It is a transparent baseline and shows the performance of a simple relationship.

9. **Why use a Decision Tree?**  
   It can learn non-linear threshold relationships between conditions and target.

10. **Why use Random Forest?**  
    It averages multiple bootstrapped trees, usually making predictions more stable than one tree.

11. **What is a train-test split?**  
    Training rows fit the model; unseen test rows estimate how it generalizes.

12. **What is MAE?**  
    Mean Absolute Error: the average size of errors without considering direction.

13. **What is RMSE?**  
    Root Mean Squared Error: an error metric that penalizes large misses more strongly.

14. **What is R²?**  
    A relative score describing how much target variation the model explains compared with a mean baseline.

15. **What is overfitting?**  
    When a model memorizes training patterns and performs poorly on new data.

16. **What is feature importance?**  
    A model-specific measure of which inputs contributed most to reducing error.

17. **What is data leakage?**  
    Letting information unavailable at prediction time influence training or evaluation.

18. **Why is preprocessing required?**  
    Models need consistent numerical representations and the same transformation at training and prediction time.

19. **Are the dataset values real measurements?**  
    No. This version uses clearly labelled synthetic demonstration data.

20. **Does the recommendation choose the best crop for farming?**  
    No. It ranks predicted water efficiency only; real decisions also require soil, climate, economics, markets, pests, and agronomy.

21. **How does the API work?**  
    React sends validated JSON to the Express REST API, which applies the trained model and returns a typed result.

22. **Why are blue/green/grey values not shown?**  
    The demo dataset lacks enough water-source and pollution data to calculate them defensibly.

23. **How does What-If work?**  
    It sends current and modified inputs separately to the same model and calculates the difference between predictions.

24. **What could improve the project?**  
    A cited measured dataset, cross-validation, uncertainty intervals, and a richer agronomic recommendation objective.