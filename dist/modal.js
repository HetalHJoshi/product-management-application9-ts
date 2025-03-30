"use strict";
import { Modal } from "bootstrap-esm";
export function showSuccessModal(message, redirect = false, redirectURL = "index.html") {
    let modalEl = document.getElementById("successModal");
    if (!modalEl) {
        const modalHTML = `
      <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-center">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title w-100" id="successModalLabel">Success</h5>
              <button type="button" class="btn-close"
                      style="border: none; background-color: transparent; box-shadow: none; background-image: none; font-size: 1.5rem; line-height: 1;"
                      data-bs-dismiss="modal" aria-label="Close">×</button>
            </div>
            <div class="modal-body" id="successMessage">
              ${message}
            </div>
          </div>
        </div>
      </div>
    `;
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        modalEl = document.getElementById("successModal");
    }
    else {
        const messageEl = document.getElementById("successMessage");
        if (messageEl) {
            messageEl.textContent = message;
        }
    }
    if (!modalEl) {
        console.error("Modal element not found.");
        return;
    }
    const modalInstance = new Modal(modalEl);
    modalInstance.show();
    setTimeout(() => {
        modalInstance.hide();
        if (redirect) {
            window.location.href = redirectURL;
        }
    }, 1500);
}
