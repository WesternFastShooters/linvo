import type { DomRenderer } from '@blocksuite/affine-block-surface';
import type { ShapeElementModel } from '@blocksuite/affine-model';
import { DefaultTheme, ShapeType } from '@blocksuite/affine-model';
import { SVGShapeBuilder } from '@blocksuite/global/gfx';

import {
  getPresetShapePoints,
  isPresetShapeType,
  pointsToSvgPath,
} from '../../preset-shape-utils.js';
import { manageClassNames, setStyles } from './utils';

function applyShapeSpecificStyles(
  model: ShapeElementModel,
  element: HTMLElement,
  zoom: number
) {
  // Reset properties that might be set by different shape types
  element.style.removeProperty('clip-path');
  element.style.removeProperty('border-radius');
  // Clear DOM for shapes that don't use SVG, or if type changes from SVG-based to non-SVG-based
  if (
    model.shapeType !== 'diamond' &&
    model.shapeType !== 'triangle' &&
    !isPresetShapeType(model.shapeType)
  ) {
    while (element.firstChild) element.firstChild.remove();
  }

  switch (model.shapeType) {
    case 'rect': {
      const w = model.w * zoom;
      const h = model.h * zoom;
      const r = model.radius ?? 0;
      const borderRadius =
        r < 1 ? `${Math.min(w * r, h * r)}px` : `${r * zoom}px`;
      element.style.borderRadius = borderRadius;
      break;
    }
    case 'ellipse':
      element.style.borderRadius = '50%';
      break;
    case 'diamond':
      element.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      break;
    case 'triangle':
      element.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
      break;
  }
  // No 'else' needed to clear styles, as they are reset at the beginning of the function.
}

function applyBorderStyles(
  model: ShapeElementModel,
  element: HTMLElement,
  strokeColor: string,
  zoom: number
) {
  element.style.border =
    model.strokeStyle !== 'none'
      ? `${model.strokeWidth * zoom}px ${model.strokeStyle === 'dash' ? 'dashed' : 'solid'} ${strokeColor}`
      : 'none';
}

function applyTransformStyles(model: ShapeElementModel, element: HTMLElement) {
  if (model.rotate && model.rotate !== 0) {
    setStyles(element, {
      transform: `rotate(${model.rotate}deg)`,
      transformOrigin: 'center',
    });
  } else {
    setStyles(element, {
      transform: '',
      transformOrigin: '',
    });
  }
}

function applyShadowStyles(
  model: ShapeElementModel,
  element: HTMLElement,
  renderer: DomRenderer
) {
  if (model.shadow) {
    const { offsetX, offsetY, blur, color } = model.shadow;
    setStyles(element, {
      boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${renderer.getColorValue(color)}`,
    });
  } else {
    setStyles(element, { boxShadow: '' });
  }
}

/**
 * Renders a ShapeElementModel to a given HTMLElement using DOM properties.
 * This function is intended to be registered via the DomElementRendererExtension.
 *
 * @param model - The shape element model containing rendering properties.
 * @param element - The HTMLElement to apply the shape's styles to.
 * @param renderer - The main DOMRenderer instance, providing access to viewport and color utilities.
 */
export const shapeDomRenderer = (
  model: ShapeElementModel,
  element: HTMLElement,
  renderer: DomRenderer
): void => {
  const { zoom } = renderer.viewport;
  const unscaledWidth = model.w;
  const unscaledHeight = model.h;

  const fillColor = renderer.getColorValue(
    model.fillColor,
    DefaultTheme.shapeFillColor,
    true
  );
  const strokeColor = renderer.getColorValue(
    model.strokeColor,
    DefaultTheme.shapeStrokeColor,
    true
  );

  element.style.width = `${unscaledWidth * zoom}px`;
  element.style.height = `${unscaledHeight * zoom}px`;
  element.style.boxSizing = 'border-box';

  // Apply shape-specific clipping, border-radius, and potentially clear innerHTML
  applyShapeSpecificStyles(model, element, zoom);

  if (
    model.shapeType === 'diamond' ||
    model.shapeType === 'triangle' ||
    isPresetShapeType(model.shapeType)
  ) {
    // For diamond and triangle, fill and border are handled by inline SVG
    element.style.border = 'none'; // Ensure no standard CSS border interferes
    element.style.backgroundColor = 'transparent'; // Host element is transparent

    const strokeW = model.strokeWidth;
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Determine if stroke should be visible and its color
    const finalStrokeColor =
      model.strokeStyle !== 'none' && strokeW > 0 ? strokeColor : 'transparent';
    // Determine dash array, only if stroke is visible and style is 'dash'
    const finalStrokeDasharray =
      model.strokeStyle === 'dash' && finalStrokeColor !== 'transparent'
        ? '12, 12'
        : 'none';
    // Determine fill color
    const finalFillColor = model.filled ? fillColor : 'transparent';

    // Build SVG safely with DOM-API
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${unscaledWidth} ${unscaledHeight}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    if (model.shapeType === ShapeType.MultiDocument) {
      for (const [dx, dy] of [
        [-12, -10],
        [-6, -5],
      ]) {
        const back = document.createElementNS(SVG_NS, 'path');
        back.setAttribute(
          'd',
          pointsToSvgPath(
            getPresetShapePoints(
              ShapeType.Document,
              [dx, dy, unscaledWidth, unscaledHeight],
              strokeW
            )
          )
        );
        back.setAttribute('fill', 'none');
        back.setAttribute('stroke', finalStrokeColor);
        back.setAttribute('stroke-width', String(strokeW));
        svg.append(back);
      }
    }

    if (model.shapeType === ShapeType.StackedRect) {
      for (const [dx, dy] of [
        [-12, -10],
        [-6, -5],
      ]) {
        const back = document.createElementNS(SVG_NS, 'path');
        back.setAttribute(
          'd',
          `M ${dx} ${dy} L ${dx + unscaledWidth} ${dy} L ${dx + unscaledWidth} ${
            dy + unscaledHeight
          } L ${dx} ${dy + unscaledHeight} Z`
        );
        back.setAttribute('fill', 'none');
        back.setAttribute('stroke', finalStrokeColor);
        back.setAttribute('stroke-width', String(strokeW));
        svg.append(back);
      }
    }

    let svgPath = '';
    if (model.shapeType === 'diamond') {
      svgPath = SVGShapeBuilder.diamondPath(
        unscaledWidth,
        unscaledHeight,
        strokeW
      );
    } else if (model.shapeType === 'triangle') {
      svgPath = SVGShapeBuilder.trianglePath(
        unscaledWidth,
        unscaledHeight,
        strokeW
      );
    } else {
      svgPath = pointsToSvgPath(
        getPresetShapePoints(
          model.shapeType,
          [0, 0, unscaledWidth, unscaledHeight],
          strokeW
        )
      );
    }

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', svgPath);
    path.setAttribute('fill', finalFillColor);
    path.setAttribute('stroke', finalStrokeColor);
    path.setAttribute('stroke-width', String(strokeW));
    if (finalStrokeDasharray !== 'none') {
      path.setAttribute('stroke-dasharray', finalStrokeDasharray);
    }
    svg.append(path);

    if (isPresetShapeType(model.shapeType)) {
      if (model.shapeType === ShapeType.Subroutine) {
        const inset = Math.min(unscaledWidth * 0.14, 18);
        for (const x of [inset, unscaledWidth - inset]) {
          const line = document.createElementNS(SVG_NS, 'line');
          line.setAttribute('x1', `${x}`);
          line.setAttribute('y1', '0');
          line.setAttribute('x2', `${x}`);
          line.setAttribute('y2', `${unscaledHeight}`);
          line.setAttribute('stroke', finalStrokeColor);
          line.setAttribute('stroke-width', String(strokeW));
          svg.append(line);
        }
      }

      if (model.shapeType === ShapeType.Cylinder) {
        const ellipse = document.createElementNS(SVG_NS, 'ellipse');
        ellipse.setAttribute('cx', `${unscaledWidth / 2}`);
        ellipse.setAttribute('cy', `${Math.min(unscaledHeight * 0.16, 18)}`);
        ellipse.setAttribute('rx', `${unscaledWidth / 2}`);
        ellipse.setAttribute('ry', `${Math.min(unscaledHeight * 0.16, 18)}`);
        ellipse.setAttribute('fill', 'none');
        ellipse.setAttribute('stroke', finalStrokeColor);
        ellipse.setAttribute('stroke-width', String(strokeW));
        svg.append(ellipse);
      }

      if (model.shapeType === ShapeType.HorizontalCylinder) {
        const inset = Math.min(unscaledWidth * 0.16, 18);
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', `${inset}`);
        line.setAttribute('y1', '0');
        line.setAttribute('x2', `${inset}`);
        line.setAttribute('y2', `${unscaledHeight}`);
        line.setAttribute('stroke', finalStrokeColor);
        line.setAttribute('stroke-width', String(strokeW));
        svg.append(line);
      }

      if (model.shapeType === ShapeType.LinedCylinder) {
        const ellipse = document.createElementNS(SVG_NS, 'ellipse');
        ellipse.setAttribute('cx', `${unscaledWidth / 2}`);
        ellipse.setAttribute('cy', `${Math.min(unscaledHeight * 0.16, 18)}`);
        ellipse.setAttribute('rx', `${unscaledWidth / 2}`);
        ellipse.setAttribute('ry', `${Math.min(unscaledHeight * 0.16, 18)}`);
        ellipse.setAttribute('fill', 'none');
        ellipse.setAttribute('stroke', finalStrokeColor);
        ellipse.setAttribute('stroke-width', String(strokeW));
        svg.append(ellipse);

        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', '8');
        line.setAttribute('y1', `${Math.min(unscaledHeight * 0.24, 20)}`);
        line.setAttribute('x2', `${unscaledWidth - 8}`);
        line.setAttribute('y2', `${Math.min(unscaledHeight * 0.24, 20)}`);
        line.setAttribute('stroke', finalStrokeColor);
        line.setAttribute('stroke-width', String(strokeW));
        svg.append(line);
      }

      if (model.shapeType === ShapeType.DoubleCircle) {
        const ellipse = document.createElementNS(SVG_NS, 'ellipse');
        ellipse.setAttribute('cx', `${unscaledWidth / 2}`);
        ellipse.setAttribute('cy', `${unscaledHeight / 2}`);
        ellipse.setAttribute('rx', `${(unscaledWidth / 2) * 0.72}`);
        ellipse.setAttribute('ry', `${(unscaledHeight / 2) * 0.72}`);
        ellipse.setAttribute('fill', 'none');
        ellipse.setAttribute('stroke', finalStrokeColor);
        ellipse.setAttribute('stroke-width', String(strokeW));
        svg.append(ellipse);
      }

      if (model.shapeType === ShapeType.FramedCircle) {
        const ellipse = document.createElementNS(SVG_NS, 'ellipse');
        ellipse.setAttribute('cx', `${unscaledWidth / 2}`);
        ellipse.setAttribute('cy', `${unscaledHeight / 2}`);
        ellipse.setAttribute('rx', `${(unscaledWidth / 2) * 0.84}`);
        ellipse.setAttribute('ry', `${(unscaledHeight / 2) * 0.84}`);
        ellipse.setAttribute('fill', 'none');
        ellipse.setAttribute('stroke', finalStrokeColor);
        ellipse.setAttribute('stroke-width', String(strokeW));
        svg.append(ellipse);
      }

      if (model.shapeType === ShapeType.CrossedCircle) {
        const inset = Math.min(Math.min(unscaledWidth, unscaledHeight) * 0.24, 18);
        for (const [x1, y1, x2, y2] of [
          [inset, inset, unscaledWidth - inset, unscaledHeight - inset],
          [unscaledWidth - inset, inset, inset, unscaledHeight - inset],
        ]) {
          const line = document.createElementNS(SVG_NS, 'line');
          line.setAttribute('x1', `${x1}`);
          line.setAttribute('y1', `${y1}`);
          line.setAttribute('x2', `${x2}`);
          line.setAttribute('y2', `${y2}`);
          line.setAttribute('stroke', finalStrokeColor);
          line.setAttribute('stroke-width', String(strokeW));
          svg.append(line);
        }
      }

      if (model.shapeType === ShapeType.Note) {
        const fold = Math.min(Math.min(unscaledWidth, unscaledHeight) * 0.22, 24);
        const foldPath = document.createElementNS(SVG_NS, 'path');
        foldPath.setAttribute(
          'd',
          `M ${unscaledWidth - fold} 0 L ${unscaledWidth - fold} ${fold} L ${unscaledWidth} ${fold}`
        );
        foldPath.setAttribute('fill', 'none');
        foldPath.setAttribute('stroke', finalStrokeColor);
        foldPath.setAttribute('stroke-width', String(strokeW));
        svg.append(foldPath);
      }

      if (model.shapeType === ShapeType.Bang) {
        const centerX = unscaledWidth / 2;
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', `${centerX}`);
        line.setAttribute('y1', `${unscaledHeight * 0.2}`);
        line.setAttribute('x2', `${centerX}`);
        line.setAttribute('y2', `${unscaledHeight * 0.62}`);
        line.setAttribute('stroke', finalStrokeColor);
        line.setAttribute('stroke-width', String(strokeW));
        svg.append(line);

        const dot = document.createElementNS(SVG_NS, 'ellipse');
        dot.setAttribute('cx', `${centerX}`);
        dot.setAttribute('cy', `${unscaledHeight * 0.78}`);
        dot.setAttribute('rx', `${Math.min(unscaledWidth * 0.04, unscaledHeight * 0.06, 4)}`);
        dot.setAttribute('ry', `${Math.min(unscaledWidth * 0.04, unscaledHeight * 0.06, 4)}`);
        dot.setAttribute('fill', finalStrokeColor);
        dot.setAttribute('stroke', 'none');
        svg.append(dot);
      }

      if (
        model.shapeType === ShapeType.TaggedDocument ||
        model.shapeType === ShapeType.TaggedRect
      ) {
        const radius = Math.min(unscaledWidth * 0.07, unscaledHeight * 0.14, 7);
        const hole = document.createElementNS(SVG_NS, 'ellipse');
        hole.setAttribute('cx', `${radius * 2.2}`);
        hole.setAttribute('cy', `${unscaledHeight / 2}`);
        hole.setAttribute('rx', `${radius}`);
        hole.setAttribute('ry', `${radius}`);
        hole.setAttribute('fill', 'none');
        hole.setAttribute('stroke', finalStrokeColor);
        hole.setAttribute('stroke-width', String(strokeW));
        svg.append(hole);
      }

      if (
        model.shapeType === ShapeType.LinedDocument ||
        model.shapeType === ShapeType.LinedRect
      ) {
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', '8');
        line.setAttribute('y1', `${Math.min(unscaledHeight * 0.24, 20)}`);
        line.setAttribute('x2', `${unscaledWidth - 8}`);
        line.setAttribute('y2', `${Math.min(unscaledHeight * 0.24, 20)}`);
        line.setAttribute('stroke', finalStrokeColor);
        line.setAttribute('stroke-width', String(strokeW));
        svg.append(line);
      }

      if (model.shapeType === ShapeType.DividedRect) {
        const dividerX = Math.min(unscaledWidth * 0.28, 28);
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', `${dividerX}`);
        line.setAttribute('y1', '0');
        line.setAttribute('x2', `${dividerX}`);
        line.setAttribute('y2', `${unscaledHeight}`);
        line.setAttribute('stroke', finalStrokeColor);
        line.setAttribute('stroke-width', String(strokeW));
        svg.append(line);
      }

      if (model.shapeType === ShapeType.WindowPane) {
        for (const [x1, y1, x2, y2] of [
          [unscaledWidth / 2, 0, unscaledWidth / 2, unscaledHeight],
          [0, unscaledHeight / 2, unscaledWidth, unscaledHeight / 2],
        ]) {
          const line = document.createElementNS(SVG_NS, 'line');
          line.setAttribute('x1', `${x1}`);
          line.setAttribute('y1', `${y1}`);
          line.setAttribute('x2', `${x2}`);
          line.setAttribute('y2', `${y2}`);
          line.setAttribute('stroke', finalStrokeColor);
          line.setAttribute('stroke-width', String(strokeW));
          svg.append(line);
        }
      }
    }

    // Replace existing children to avoid memory leaks
    element.replaceChildren(svg);
  } else {
    // Standard rendering for other shapes (e.g., rect, ellipse)
    // innerHTML was already cleared by applyShapeSpecificStyles if necessary
    element.style.backgroundColor = model.filled ? fillColor : 'transparent';
    applyBorderStyles(model, element, strokeColor, zoom); // Uses standard CSS border
  }

  applyTransformStyles(model, element);

  element.style.zIndex = renderer.layerManager.getZIndex(model).toString();

  manageClassNames(model, element);
  applyShadowStyles(model, element, renderer);
};
