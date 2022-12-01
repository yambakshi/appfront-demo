import { isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, Inject, Input, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'spinning-loader',
  templateUrl: './spinning-loader.component.html',
  styleUrls: ['./spinning-loader.component.scss',]
})
export class SpinningLoaderComponent implements AfterViewChecked {
  @Input() color: string = '#ffffff';
  @ViewChild('spinningLoader') spinningLoader: ElementRef;

  // When loader size is 100 border width is 5
  loaderBig: { size: number, borderWidth: number } = { size: 100, borderWidth: 5 };

  // When loader size is 20 border width is 3
  loaderSmall: { size: number, borderWidth: number } = { size: 20, borderWidth: 4 };
  ratio: number = 20 / 1;
  afterViewCheckedEnabled: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer: Renderer2) {
    const { loaderBig, loaderSmall } = this;
    this.ratio = (loaderBig.borderWidth - loaderSmall.borderWidth) / (loaderBig.size - loaderSmall.size);
  }

  ngAfterViewChecked(): void {
    if (!isPlatformBrowser(this.platformId) || !this.afterViewCheckedEnabled) return;
    const spinningLoaderElement = this.spinningLoader.nativeElement
    const size = spinningLoaderElement.parentElement.clientWidth;
    if (!size) return;

    this.afterViewCheckedEnabled = false;
    const { r, g, b } = this.hexToRgba(this.color);
    const calcBorderWidth = size => {
      const borderWidth = this.loaderBig.borderWidth - (this.ratio * (this.loaderBig.size - size));
      return borderWidth;
    }

    const borderWidth = calcBorderWidth(size);
    const border = `${borderWidth}px solid rgba(${r}, ${g}, ${b}, 0.2)`;
    this.renderer.setStyle(spinningLoaderElement, 'width', `calc(100% - ${2 * borderWidth}px)`);
    this.renderer.setStyle(spinningLoaderElement, 'height', `calc(100% - ${2 * borderWidth}px)`);
    this.renderer.setStyle(spinningLoaderElement, 'border', border);
    this.renderer.setStyle(spinningLoaderElement, 'border-left-color', this.color);
  }

  hexToRgba(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}