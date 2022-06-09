export class LoadingHandler {
  private timeout: any;
  isLoading = false;

  start() {
    this.timeout = setTimeout(() => {
      this.isLoading = true;
    }, 1000);
  }
  finish() {
    this.isLoading = false;
    clearTimeout(this.timeout);
  }
}
