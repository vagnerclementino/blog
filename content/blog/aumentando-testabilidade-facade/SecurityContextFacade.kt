package com.hotmart.developers.sales.application.infrastructure.config

import org.springframework.security.core.context.SecurityContext

interface SecurityContextFacade {
    fun getContext(): SecurityContext
}
