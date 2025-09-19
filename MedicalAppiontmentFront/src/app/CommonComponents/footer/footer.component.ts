import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  // ---- Back to Top Button Function Start ----
  showButton: boolean = false;
  // Show button after scrolling 200px
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.pageYOffset > 200;
  }
  // Scroll to top smoothly
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // ---- Back to Top Button Function End ----
}
