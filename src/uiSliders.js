"use strict";

import { addClasses } from "./uiUtility";

export { Slider };

function Slider(max = 100, min = 0, step = 1, cssClasses, sliderId, title)
{
    const sliderContainer = SliderContainer(cssClasses.sliderContainer);
    const sliderBar = SliderBar(cssClasses.slider, sliderId, max, min, step);
    const sliderLabel = SliderLabel(cssClasses.sliderLabel);
    const sliderTitle = SliderTitle(cssClasses.sliderTitle);
    sliderTitle.setText(title);
    sliderLabel.setLabelValue(sliderBar.getValue());
    sliderLabel.assignLabel(sliderId);

    sliderContainer.element.append(
        sliderTitle.element,
        sliderBar.element,
        sliderLabel.element
    );

    sliderBar.element.addEventListener("input", () => {

        sliderLabel.setLabelValue(sliderBar.getValue());
    });

    function getValue()
    {
        return sliderBar.getValue();
    }

    return{
        element: sliderContainer.element,

        getValue,
    }
}

function SliderTitle(sliderTitleClasses)
{
    const h1 = document.createElement("h1");
    addClasses(h1, sliderTitleClasses);

    function setText(newText)
    {
        h1.innerText = newText;
    }

    return {
        element: h1,

        setText,
    }

}

function SliderContainer(sliderContainerClasses)
{
    const container = document.createElement("div");
    addClasses(container, sliderContainerClasses);

    return {
        element: container,
    }
}

function SliderBar(sliderClasses, sliderId, max, min, step)
{
    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = sliderId;
    slider.max = max;
    slider.min = min;
    slider.step = step;
    addClasses(slider, sliderClasses);

    function getValue()
    {
        return slider.value;
    }

    return {
        element: slider,

        getValue,
    }
}

function SliderLabel(sliderLabelClasses)
{
    const lbl = document.createElement("label");
    addClasses(lbl, sliderLabelClasses);

    function setLabelValue(newValue)
    {
        lbl.innerText = newValue;
    }

    function assignLabel(id)
    {
        lbl.setAttribute("for", id);
    }

    return {
        element: lbl,

        setLabelValue,
        assignLabel,
    }
}