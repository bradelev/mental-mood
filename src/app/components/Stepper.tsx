const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ['Feelings', 'Chat', 'Goals'];
  
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div key={index} className={`step ${index === currentStep ? 'active' : ''}`}>
          {step}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
