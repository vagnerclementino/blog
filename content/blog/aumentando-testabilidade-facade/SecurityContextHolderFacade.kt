package com.hotmart.developers.sales.application.infrastructure.config

import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder

class SecurityContextHolderFacade : SecurityContextFacade {
    override fun getContext(): SecurityContext = SecurityContextHolder.getContext()
}
